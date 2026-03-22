import type { FinalConfigurationType } from "$lib/types/FinalConfigurationType";
import type { GemType } from "$lib/types/GemType";
import type { TreasureType } from "$lib/types/TreasureType";
import { PriorityQueue } from "./priorityQueue";

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

type Config = {
    gems: number[];
    treasure: TreasureType;
    value: number
}

let possibleConfigurations: Map<string, Config[]> = new Map();

function generateConfigsForTreasure(treasure: TreasureType, gems: GemType[]) {
    finalConfigurations = new PriorityQueue();
    recursion(gems, [treasure]);
    let allConfigs = finalConfigurations.getItems().map((fc): Config => ({
        gems: (() => {
            if (fc.treasures[0].gemConfiguration)
                return fc.treasures[0].gemConfiguration!.reduce((acc, g) => {
                    switch (g.name) {
                        case "Ruby": acc[0]++; break;
                        case "Sapphire": acc[1]++; break;
                        case "Yellow Diamond": acc[2]++; break;
                        case "Emerald": acc[3]++; break;
                        case "Alexandrite": acc[4]++; break;
                        case "Red Beryl": acc[5]++; break;
                    }
                    return acc;
                }, [0, 0, 0, 0, 0, 0] as number[]);
            else return [0, 0, 0, 0, 0, 0];
        })(),
        treasure: cloneTreasure(fc.treasures[0]),
        value: fc.treasures[0].finalValue!
    }))

    finalConfigurations = new PriorityQueue();
    // Remove duplicates
    let uniqueConfigs = [];
    let seen: Set<number> = new Set();
    for (let c of allConfigs) {
        let key = c.gems.reduce((acc, g) => {
            acc *= 10;
            acc += g;
            return acc;
        }, 0)
        if (!seen.has(key)) {
            seen.add(key);
            uniqueConfigs.push(c);
        }
    }

    // Filter out single gem slot
    uniqueConfigs = uniqueConfigs.filter(c => c.gems.reduce((acc, g) => acc + g, 0) != 1);

    // Set final var
    possibleConfigurations.set(
        treasure.name,
        uniqueConfigs
    );

}

//let finalConfigurations: FinalConfigurationType[] = []
let finalConfigurations: PriorityQueue<FinalConfigurationType> = new PriorityQueue();
let seen = new Set<string>();
let gemCache: Map<string, GemType[]> = new Map();


export function alogorithm(gems: GemType[], treasures: TreasureType[]): FinalConfigurationType[] {

    finalConfigurations = new PriorityQueue();
    possibleConfigurations = new Map();
    seen = new Set();
    memo = new Map();
    gemCache = new Map();

    // Generate gemCache
    for (const g of gems) {
        let gemArray: GemType[] = new Array(g.quantity + 1);
        for (let i = 0; i <= g.quantity; i++) {
            gemArray[i] = { ...g };
            gemArray[i].quantity = i;
        }
        gemCache.set(g.name, gemArray);
    }

    console.log("GENERATING CONFIGS!");
    for (let t of treasures) {
        if (t.quantity > 0) {
            generateConfigsForTreasure(t, gems);
        }
    }

    // TODO: workaroudn for later
    let tmpTreasures: TreasureType[] = [];
    for (const t of treasures) {
        for (let i = t.quantity; i > 0; i--) {
            tmpTreasures.push(cloneTreasure(t));
        }
    }
    treasures = tmpTreasures;



    console.log(possibleConfigurations);

    console.log("STARTING ALGORITHM...", gems, treasures);
    recursionOptimized(gems, treasures);
    console.log("ALGORITHM DONE!");
    console.log(finalConfigurations)

    // Order finalConfigurations by value in descending order
    //finalConfigurations.sort((a, b) => b.value - a.value);

    console.log(finalConfigurations.size());

    return finalConfigurations.getItems();

}

function recursion(gems: GemType[], treasures: TreasureType[]) {
    /*for (const gem of gems) {
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
    }*/
    for (const treasure of treasures) {
        for (const gem of gems) {
            if (gem.quantity > 0) {
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


let memo = new Map<string, number>();
let max = 0;
function recursionOptimized(gems: GemType[], treasures: TreasureType[], index = 0, config: Config[] = []) {
    if (treasures.length == index) {
        addToFinalConfiguration2(gems, treasures, config);

        return;
    }

    // TODO: MEMO
    let g = gems.map(g => g.quantity).reduce((acc, g) => { acc += "" + g; return acc; }, "");
    let v = 0;
    for (let i = 0; i < index; i++) v += treasures[i].finalValue!;
    let key = g + "#" + index;
    if (memo.has(key) && memo.get(key)! >= v) return;
    memo.set(key, v);

    //for (let ii = index; ii < treasures.length; ii++) {
    const treasure = treasures[index];
    for (const pc of possibleConfigurations.get(treasure.name)!) {
        let ok = true;
        for (let i = 0; i < 6; i++) {
            if (pc.gems[i] > gems[i].quantity) {
                ok = false;
                break;
            }
        }
        if (ok) {
            //let treasureTmp = cloneTreasure(treasure);
            let treasureTmp = treasure;
            for (let i = 0; i < 6; i++) {
                gems[i].quantity -= pc.gems[i];
            }
            /*treasure.gemConfiguration = pc.treasure.gemConfiguration;
            treasure.finalValue = pc.value;
            treasure.smallSlots = pc.treasure.smallSlots;
            treasure.largeSlots = pc.treasure.largeSlots;*/
            treasures[index] = pc.treasure;
            config.push(pc);
            recursionOptimized(gems, treasures, index + 1, config);
            config.pop();
            for (let i = 0; i < 6; i++) {
                gems[i].quantity += pc.gems[i];
            }
            treasures[index] = treasureTmp;
            /*treasure.gemConfiguration = treasureTmp.gemConfiguration;
            treasure.finalValue = treasureTmp.baseValue;
            treasure.smallSlots = treasureTmp.smallSlots;
            treasure.largeSlots = treasureTmp.largeSlots;*/
        }
    }
    //}

    //calculateValue(gems, treasures);
    //console.log(gems, treasures);
    // TODO: OPTIMIZE
    //addToFinalConfiguration(gems, treasures, 123);
}

function calculateValue(gems: GemType[], treasures: TreasureType[]) {
    let value = 0;
    for (const gem of gems) {
        value += Math.round(gem.baseValue * gem.quantity);
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


        value += Math.round(tValue);
        treasure.finalValue = Math.round(tValue);
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
    finalConfigurations.enqueue(fc, fc.value);
}

function addToFinalConfiguration2(gems: GemType[], treasures: TreasureType[], config: Config[]) {

    let value = 0;
    for (const g of gems) {
        value += (g.quantity * g.baseValue);
    }
    for (const t of treasures) {
        value += t.finalValue!;
    }

    //const deepCopyGems = gems.map(gem => ({ ...gem }));
    /*const deepCopyTreasures = treasures.map(treasure => ({
        ...treasure,
        gemConfiguration: treasure.gemConfiguration ? [...treasure.gemConfiguration] : undefined
    }));*/
    const fc: FinalConfigurationType = {
        gems: gems.map(g => gemCache.get(g.name)![g.quantity]),
        //treasures: deepCopyTreasures,
        treasures: config.map(c => c.treasure),
        value: value
    };
    finalConfigurations.enqueue(fc, value);
}

function cloneTreasure(treasure: TreasureType): TreasureType {
    return {
        ...treasure,
        gemConfiguration: treasure.gemConfiguration ? [...treasure.gemConfiguration] : undefined
    }
}