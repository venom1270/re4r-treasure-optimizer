import type { GemType } from "./GemType";

export type TreasureType = {
    name: string;
    baseValue: number;
    smallSlots: number;
    largeSlots: number;
    imageSrc: string;
    gemConfiguration: undefined | GemType[];
    quantity: number; // This is temporary! TODO: LATER MAKE IT LIEK A LIST WHERE USER CAN ADD/DELETE TREASURES!!!
}