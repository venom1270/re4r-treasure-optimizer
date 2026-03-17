import type { FinalConfigurationType } from "$lib/types/FinalConfigurationType";
import type { GemType } from "$lib/types/GemType";
import type { TreasureType } from "$lib/types/TreasureType";

function slotGem(gem: GemType, treasure: TreasureType): boolean {

    if (gem.quantity <= 0) return false;

    let slot = false;

    if (gem.large && treasure.largeSlots > 0) {
        if (treasure.gemConfiguration == undefined) treasure.gemConfiguration = new Array();
        treasure.gemConfiguration.push(gem);
        treasure.largeSlots--;
        gem.quantity--;
        slot = true;
    } else if (!gem.large && treasure.smallSlots > 0) {
        if (treasure.gemConfiguration == undefined) treasure.gemConfiguration = new Array();
        treasure.gemConfiguration.push(gem);
        treasure.smallSlots--;
        gem.quantity--;
        slot = true;
    }


    return slot;
}

function unslotGem(gem: GemType, treasure: TreasureType) {
    if (gem.large) {
        treasure.largeSlots++;
    } else if (!gem.large) {
        treasure.smallSlots++;
    }
    treasure.gemConfiguration!.pop();
    gem.quantity++;

}

let finalConfigurations: FinalConfigurationType[] = []

export function alogorithm(gems: GemType[], treasures: TreasureType[]): FinalConfigurationType[] {

    finalConfigurations = [];

    // TODO: workaroudn for later
    let tmpTreasures: TreasureType[] = [];
    for (const t of treasures) {
        for (let i = t.quantity; i > 0; i--) {
            tmpTreasures.push(t);
        }
    }
    treasures = tmpTreasures;

    console.log("STARTING ALGORITHM...", gems, treasures);
    recursion(gems, treasures);
    console.log("ALGORITHM DONE!");

    // Order finalConfigurations by value in descending order
    finalConfigurations.sort((a, b) => b.value - a.value);

    // Remove "duplicates"
    // Two configurations are considered duplicates if they have the same set of treasures
    // with the same gem allocation, regardless of the ordering of treasures or the ordering of gems inside each treasure.
    const seen = new Set<string>();
    const unique: FinalConfigurationType[] = [];

    for (const fc of finalConfigurations) {
        // Canonicalize the configuration for comparison
        const gemsKey = fc.gems
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(g => `${g.name}:${g.quantity}`)
            .join("|");

        const treasuresKey = fc.treasures
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(t => {
                const gemNames = (t.gemConfiguration ?? [])
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(g => g.name)
                    .join(",");

                return `${t.name}:[${gemNames}]`;
            })
            .join("|");

        const key = `${gemsKey}||${treasuresKey}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(fc);
        }
    }
    // END OF AI GENERATED PART... i guess it works
    console.log(finalConfigurations.length);
    console.log(unique);

    return unique;

}

function recursion(gems: GemType[], treasures: TreasureType[]) {
    for (const gem of gems) {
        if (gem.quantity > 0) {
            // Try slotting this gem
            for (const treasure of treasures) {
                let ok = slotGem(gem, treasure);
                if (ok) {
                    recursion(gems, treasures);
                    unslotGem(gem, treasure);
                }
            }
        }
    }

    // CALCULATE VALUE
    calculateValue(gems, treasures);
}

function calculateValue(gems: GemType[], treasures: TreasureType[]) {
    let value = 0;
    for (const gem of gems) {
        value += gem.baseValue * gem.quantity;
    }

    for (const treasure of treasures) {
        let tValue = treasure.baseValue;
        if (treasure.gemConfiguration) {
            for (const gem of treasure.gemConfiguration) {
                tValue += gem.baseValue;
            }
        }

        // Mutliplier
        let mp = calculateMultiplier(treasure);
        //console.log(mp);
        tValue *= mp;

        value += tValue;
        treasure.finalValue = tValue;
    }

    addToFinalConfiguration(gems, treasures, value);
}

function calculateMultiplier(treasure: TreasureType): number {
    if (treasure.gemConfiguration) {
        let n = treasure.gemConfiguration?.length;
        let d = new Set(treasure.gemConfiguration.map(t => t.name)).size;

        // Group counts by gem type (Ruby + Red Beryl count as the same group)
        let groups: number[] = [];
        const groupIndex = new Map<string, number>();
        for (const gem of treasure.gemConfiguration) {
            const key = gem.name === "Ruby" || gem.name === "Red Beryl" ? "Ruby" : gem.name;
            const idx = groupIndex.get(key);
            if (idx === undefined) {
                groupIndex.set(key, groups.length);
                groups.push(1);
            } else {
                groups[idx]++;
            }
        }

        // Ensure groups are in ascending order (e.g., [1,2] not [2,1])
        groups.sort((a, b) => a - b);

        if (n == 2) {
            if (d == 2) return 1.1;
            if (d == 1) return 1.2;
        } else if (n == 3) {
            if (d == 3) return 1.3;
            if (d == 1) return 1.4;
        } else if (n == 4) {
            // check duo, four colors, quartet, two duos, trio
            if (d == 3) return 1.3;
            if (d == 4) return 1.6;
            if (d == 1) return 1.7;
            if (d == 2 && groups[0] == 2 && groups[1] == 2) return 1.5;
        } else if (n == 5) {
            // Check quintet, five colors
            if (d == 1) return 1.9;
            if (d == 5) return 2;
            // Check duo & trio
            if (d == 2 && groups[0] == 2 && groups[1] == 3) return 1.8;
            // Check two duos
            if (d == 3 && groups[1] == 2 && groups[2] == 2) return 1.5;
            // Check trio
            if (d == 3 && groups[2] == 3) return 1.4;
            // Check four colors
            if (d == 4) return 1.7;
        }

        /*if (n == 2) {
            if (d == 2) return 1.1;
            if (d == 1) return 1.2;
        } else if (n == 3) {
            if (d == 3) return 1.3;
            if (d == 1) return 1.4;
        } else if (n == 4) {
            if (d == 2) return 1.5;
            if (d == 4) return 1.6;
            if (d == 1) return 1.7;
        } else if (n == 5) {
            if (d == 2) return 1.8;
            if (d == 1) return 1.9;
            if (d == 5) return 2;
        }*/
    }

    return 1;
}


function addToFinalConfiguration(gems: GemType[], treasures: TreasureType[], value: number) {
    const deepCopyGems = gems.map(gem => ({ ...gem }));
    const deepCopyTreasures = treasures.map(treasure => ({
        ...treasure,
        gemConfiguration: treasure.gemConfiguration ? [...treasure.gemConfiguration] : undefined
    }));
    const fc: FinalConfigurationType = {
        gems: deepCopyGems,
        treasures: deepCopyTreasures,
        value: value
    };
    finalConfigurations.push(fc);
}