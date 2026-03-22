/// <reference lib="webworker" />

import { alogorithm } from "./algorithm2";
import type { FinalConfigurationType } from '$lib/types/FinalConfigurationType';

self.onmessage = (event: MessageEvent) => {
    const { gems, treasures } = event.data;

    try {
        const result: FinalConfigurationType[] = alogorithm(gems, treasures);


        self.postMessage({ success: true, result: result });
    } catch (err: any) {
        self.postMessage({
            success: false,
            error: err?.message || String(err)
        });
    }
};