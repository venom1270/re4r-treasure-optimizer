import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';

function extractJson(text: string): Record<string, unknown> | null {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        return null;
    }
    const jsonText = text.slice(start, end + 1);
    try {
        return JSON.parse(jsonText);
    } catch {
        return null;
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const apiKey = OPENAI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY in environment' }), { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('screenshot');
        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'No screenshot file provided' }), { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return new Response(JSON.stringify({ error: 'Uploaded file is not an image' }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        let base64: string;
        if (typeof Buffer !== 'undefined') {
            base64 = Buffer.from(arrayBuffer).toString('base64');
        } else {
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            base64 = typeof btoa !== 'undefined' ? btoa(binary) : '';
        }

        const dataUrl = `data:${file.type};base64,${base64}`;

        const prompt = `You are an assistant that extracts Resident Evil 4 Remake inventory counts from a screenshot. The user screenshot includes gem and treasure item names with quantities. Note that treasures do not have quantities, each treasure counts as one. Return only a strict JSON object with exactly two properties: gems (array of {name, quantity}) and treasures (array of {name, quantity}). Use the following exact known RE4 names if they appear (ignore unrecognized names):\n- Gems: Ruby, Sapphire, Yellow Diamond, Emerald, Alexandrite, Red Beryl\n- Treasures: Butterfly Lamp, Chalice of Atonement, Elegant Bangle, Elegant Crown, Elegant Mask, Extravagant Clock, Flagon, Golden Lynx, Ornate Necklace, Splendid Bangle\nDo not include additional text, explanation, or markdown. If a quantity cannot be read, use 0.`;

        const openAIRequestBody = {
            model: 'gpt-4.1-mini',
            input: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_text', text: prompt },
                        { type: 'input_image', image_url: dataUrl }
                    ]
                }
            ],
            max_output_tokens: 800,
            temperature: 0.0
        };

        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(openAIRequestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: `OpenAI error: ${response.status} ${errText}` }), { status: 502 });
        }

        const apiResult = await response.json();
        let outputText = '';

        if (typeof apiResult.output_text === 'string') {
            outputText = apiResult.output_text;
        } else if (Array.isArray(apiResult.output)) {
            for (const block of apiResult.output) {
                if (typeof block === 'object' && block !== null) {
                    if ('content' in block && Array.isArray((block as any).content)) {
                        for (const content of (block as any).content) {
                            if (content?.type === 'output_text' && typeof content.text === 'string') {
                                outputText += content.text;
                            }
                        }
                    }
                    if ((block as any).type === 'output_text' && typeof (block as any).text === 'string') {
                        outputText += (block as any).text;
                    }
                }
            }
        } else if (apiResult.output && apiResult.output?.[0]?.content) {
            for (const entry of apiResult.output[0].content as any[]) {
                if (entry?.type === 'output_text' && typeof entry.text === 'string') {
                    outputText += entry.text;
                }
            }
        }

        const parsed = extractJson(outputText);
        if (!parsed) {
            return new Response(JSON.stringify({ error: 'Could not parse JSON from OpenAI response', rawOutput: outputText, rawApiResult: apiResult }), { status: 500 });
        }

        const normalized = {
            gems: Array.isArray(parsed.gems) ? parsed.gems.map((g: any) => ({ name: String(g.name ?? '').trim(), quantity: Number(g.quantity ?? 0) || 0 })) : [],
            treasures: Array.isArray(parsed.treasures) ? parsed.treasures.map((t: any) => ({ name: String(t.name ?? '').trim(), quantity: Number(t.quantity ?? 0) || 0 })) : []
        };

        return new Response(JSON.stringify(normalized), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error: any) {
        console.error('inventory-from-image error', error);
        return new Response(JSON.stringify({ error: `Internal server error: ${error?.message || error}` }), { status: 500 });
    }
};
