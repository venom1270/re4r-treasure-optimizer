import imgRuby from '$lib/images/gems/ruby.png';
import imgSapphire from '$lib/images/gems/sapphire.png';
import imgYellowDiamond from '$lib/images/gems/yellowDiamond.png';
import imgEmerald from '$lib/images/gems/emerald.png';
import imgAlexandrite from '$lib/images/gems/alexandrite.png';
import imgRedBeryl from '$lib/images/gems/redBeryl.png';
import type { GemType } from '$lib/types/GemType';

export const gems: GemType[] = [
    {
        name: 'Ruby',
        symbol: "🔴",
        baseValue: 3000,
        imageSrc: imgRuby,
        large: false,
        quantity: 0
    },
    {
        name: 'Sapphire',
        symbol: "🔵",
        baseValue: 4000,
        imageSrc: imgSapphire,
        large: false,
        quantity: 0
    },
    {
        name: 'Yellow Diamond',
        symbol: "🟡",
        baseValue: 7000,
        imageSrc: imgYellowDiamond,
        large: false,
        quantity: 0
    },
    {
        name: 'Emerald',
        symbol: "🟩",
        baseValue: 5000,
        imageSrc: imgEmerald,
        large: true,
        quantity: 0
    },
    {
        name: 'Alexandrite',
        symbol: "🟪",
        baseValue: 6000,
        imageSrc: imgAlexandrite,
        large: true,
        quantity: 0
    },
    {
        name: 'Red Beryl',
        symbol: "🟥",
        baseValue: 9000,
        imageSrc: imgRedBeryl,
        large: true,
        quantity: 0
    },
];