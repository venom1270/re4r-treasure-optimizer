import imgButterflyLamp from '$lib/images/treasures/Butterfly Lamp.jpg';
import imgChaliceOfAtonement from '$lib/images/treasures/Chalice of Atonement.jpg';
import imgElegantBangle from '$lib/images/treasures/Elegant Bangle.jpg';
import imgElegantCrown from '$lib/images/treasures/Elegant Crown.jpg';
import imgElegantMask from '$lib/images/treasures/Elegant Mask.jpg';
import imgExtravagantClock from '$lib/images/treasures/Extravagant Clock.jpg';
import imgFlagon from '$lib/images/treasures/Flagon.jpg';
import imgGoldenLynx from '$lib/images/treasures/Golden Lynx.jpg';
import imgOrnateNecklace from '$lib/images/treasures/Ornate Necklace.jpg';
import imgSplendidBangle from '$lib/images/treasures/Splendid Bangle.jpg';
import type { TreasureType } from '$lib/types/TreasureType';

export const treasures: TreasureType[] = [
    {
        name: 'Butterfly Lamp',
        baseValue: 6000,
        smallSlots: 3,
        largeSlots: 0,
        imageSrc: imgButterflyLamp,
        quantity: 0
    },
    {
        name: 'Chalice of Atonement',
        baseValue: 7000,
        smallSlots: 0,
        largeSlots: 3,
        imageSrc: imgChaliceOfAtonement,
        quantity: 0
    },
    {
        name: 'Elegant Bangle',
        baseValue: 5000,
        smallSlots: 2,
        largeSlots: 0,
        imageSrc: imgElegantBangle,
        quantity: 0
    },
    {
        name: 'Elegant Crown',
        baseValue: 19000,
        smallSlots: 2,
        largeSlots: 3,
        imageSrc: imgElegantCrown,
        quantity: 0
    },
    {
        name: 'Elegant Mask',
        baseValue: 5000,
        smallSlots: 3,
        largeSlots: 0,
        imageSrc: imgElegantMask,
        quantity: 0
    },
    {
        name: 'Extravagant Clock',
        baseValue: 9000,
        smallSlots: 1,
        largeSlots: 1,
        imageSrc: imgExtravagantClock,
        quantity: 0
    },
    {
        name: 'Flagon',
        baseValue: 4000, smallSlots: 2,
        largeSlots: 0,
        imageSrc: imgFlagon,
        quantity: 0
    },
    {
        name: 'Golden Lynx',
        baseValue: 15000,
        smallSlots: 2,
        largeSlots: 1,
        imageSrc: imgGoldenLynx,
        quantity: 0
    },
    {
        name: 'Ornate Necklace',
        baseValue: 11000,
        smallSlots: 2,
        largeSlots: 2,
        imageSrc: imgOrnateNecklace,
        quantity: 0
    },
    {
        name: 'Splendid Bangle',
        baseValue: 4000,
        smallSlots: 0,
        largeSlots: 2,
        imageSrc: imgSplendidBangle,
        quantity: 0
    }
];