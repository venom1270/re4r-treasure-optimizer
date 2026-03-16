import type { GemType } from "./GemType"
import type { TreasureType } from "./TreasureType";

export type FinalConfigurationType = {
    gems: GemType[];
    treasures: TreasureType[];
    value: number;
}