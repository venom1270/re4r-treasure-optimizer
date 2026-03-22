import type { FinalConfigurationType } from "$lib/types/FinalConfigurationType";
import type { GemType } from "$lib/types/GemType";
import type { TreasureType } from "$lib/types/TreasureType";

let finalConfigurations: FinalConfigurationType[] = [];


export function alogorithm(gems: GemType[], treasures: TreasureType[]): FinalConfigurationType[] {
    finalConfigurations = [];

    // Expand treasures by quantity so we treat each instance separately
    const expandedTreasures: TreasureType[] = [];
    for (const t of treasures) {
        for (let i = t.quantity; i > 0; i--) {
            expandedTreasures.push({ ...t });
        }
    }

    // Precompute all possible gem configurations for each treasure type (based on slot counts)
    const configCache = new Map<string, GemType[][]>();
    const gemByName = new Map(gems.map(g => [g.name, g]));

    const treasureConfigs = expandedTreasures.map(t => {
        const key = `${t.smallSlots}:${t.largeSlots}`;
        if (!configCache.has(key)) {
            configCache.set(key, generateConfigsForTreasure(t, gems));
        }
        return configCache.get(key)!;
    });

    // Precompute an optimistic maximum additional value (gain) per treasure
    // so that we can prune recursion branches early.
    const maxGainPerTreasure = treasureConfigs.map((configs, idx) => {
        const treasure = expandedTreasures[idx];
        let bestGain = 0;
        for (const config of configs) {
            const gemBase = config.reduce((sum, g) => sum + g.baseValue, 0);
            const tValue = (treasure.baseValue + gemBase) * calculateMultiplierForConfig(config);
            const gain = tValue - gemBase; // extra over leaving gems unassigned
            if (gain > bestGain) bestGain = gain;
        }
        return bestGain;
    });

    const maxGainSuffix: number[] = [];
    let accGain = 0;
    for (let i = expandedTreasures.length - 1; i >= 0; i--) {
        accGain += maxGainPerTreasure[i];
        maxGainSuffix[i] = accGain;
    }

    let bestValue = -Infinity;

    console.log(maxGainPerTreasure);
    console.log(treasureConfigs);

    console.log("STARTING ALGORITHM...", gems, expandedTreasures);

    backtrack(0, 0);

    console.log("ALGORITHM DONE!");

    // Order finalConfigurations by value in descending order
    finalConfigurations.sort((a, b) => b.value - a.value);

    // Remove duplicate configurations (ignore ordering of treasures and gems)
    const seen = new Set<string>();
    const unique: FinalConfigurationType[] = [];

    for (const fc of finalConfigurations) {
        const gemsKey = fc.gems
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(g => `${g.name}:${g.quantity}`)
            .join("|");

        const treasuresKey = fc.treasures
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => {
                const nameCompare = a.name.localeCompare(b.name);
                if (nameCompare !== 0) return nameCompare;

                const aGemConfig = (a.gemConfiguration ?? [])
                    .slice()
                    .sort((g1, g2) => g1.name.localeCompare(g2.name))
                    .map(g => g.name)
                    .join(",");
                const bGemConfig = (b.gemConfiguration ?? [])
                    .slice()
                    .sort((g1, g2) => g1.name.localeCompare(g2.name))
                    .map(g => g.name)
                    .join(",");

                return aGemConfig.localeCompare(bGemConfig);
            })
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

    console.log(finalConfigurations.length);
    console.log(unique);

    return unique;

    function backtrack(index: number, configuredValue: number) {
        if (index >= expandedTreasures.length) {
            const totalValue = calculateValue(gems, expandedTreasures);
            if (totalValue > bestValue) bestValue = totalValue;
            return;
        }

        const remainingGemsValue = Array.from(gemByName.values()).reduce(
            (sum, g) => sum + g.baseValue * g.quantity,
            0
        );
        const optimisticTotal = configuredValue + remainingGemsValue + (maxGainSuffix[index] ?? 0);
        if (optimisticTotal <= bestValue) return;

        const treasure = expandedTreasures[index];
        const configs = treasureConfigs[index];

        for (const config of configs) {
            if (!canUseConfig(config, gemByName)) continue;

            applyConfig(config, gemByName);
            treasure.gemConfiguration = config.map(g => ({ ...g, quantity: 1 }));

            const gemBase = config.reduce((sum, g) => sum + g.baseValue, 0);
            const treasureValue = (treasure.baseValue + gemBase) * calculateMultiplierForConfig(config);

            backtrack(index + 1, configuredValue + treasureValue);

            treasure.gemConfiguration = undefined;
            revertConfig(config, gemByName);
        }
    }

    function canUseConfig(config: GemType[], gemMap: Map<string, GemType>) {
        const required = new Map<string, number>();
        for (const gem of config) {
            required.set(gem.name, (required.get(gem.name) ?? 0) + 1);
        }
        for (const [name, qty] of required) {
            const gem = gemMap.get(name);
            if (!gem || gem.quantity < qty) return false;
        }
        return true;
    }

    function applyConfig(config: GemType[], gemMap: Map<string, GemType>) {
        for (const gem of config) {
            const g = gemMap.get(gem.name);
            if (g) g.quantity--;
        }
    }

    function revertConfig(config: GemType[], gemMap: Map<string, GemType>) {
        for (const gem of config) {
            const g = gemMap.get(gem.name);
            if (g) g.quantity++;
        }
    }
}

function generateConfigsForTreasure(treasure: TreasureType, gems: GemType[]): GemType[][] {
    // Use only unique gem types by name when building configurations.
    // This avoids duplicate gem configurations when the input has multiple
    // entries for the same gem type.
    const uniqueGemsByName = new Map<string, GemType>();
    for (const g of gems) {
        if (!uniqueGemsByName.has(g.name)) {
            uniqueGemsByName.set(g.name, { ...g, quantity: 1 });
        }
    }

    const uniqueGems = Array.from(uniqueGemsByName.values());
    const smallGems = uniqueGems.filter(g => !g.large);
    const largeGems = uniqueGems.filter(g => g.large);

    const smallCombos = generateMultisetCombos(smallGems, treasure.smallSlots);
    const largeCombos = generateMultisetCombos(largeGems, treasure.largeSlots);

    const configs: GemType[][] = [];
    for (const small of smallCombos) {
        for (const large of largeCombos) {
            configs.push([...small, ...large]);
        }
    }

    // Ensure uniqueness across the combined configs (in case of empty slots/duplicates)
    const seen = new Set<string>();
    const uniqueConfigs: GemType[][] = [];
    for (const config of configs) {
        const key = config
            .map(g => g.name)
            .sort()
            .join("|");
        if (!seen.has(key)) {
            seen.add(key);
            uniqueConfigs.push(config);
        }
    }

    return uniqueConfigs;
}

function generateMultisetCombos(gems: GemType[], maxSlots: number): GemType[][] {
    const results: GemType[][] = [];

    function helper(start: number, remaining: number, combo: GemType[]) {
        results.push([...combo]);
        if (remaining === 0) return;
        for (let i = start; i < gems.length; i++) {
            combo.push(gems[i]);
            helper(i, remaining - 1, combo);
            combo.pop();
        }
    }

    helper(0, maxSlots, []);
    return results;
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

        // Multiplier
        const mp = calculateMultiplier(treasure);
        tValue *= mp;

        value += tValue;
        treasure.finalValue = tValue;
    }

    addToFinalConfiguration(gems, treasures, value);
    return value;
}

function calculateMultiplierForConfig(config?: GemType[]): number {
    if (!config || config.length === 0) return 1;

    const n = config.length;
    const d = new Set(config.map(t => t.name)).size;

    // Group counts by gem type (Ruby + Red Beryl count as the same group)
    const groups: number[] = [];
    const groupIndex = new Map<string, number>();
    for (const gem of config) {
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

    return 1;
}

function calculateMultiplier(treasure: TreasureType): number {
    return calculateMultiplierForConfig(treasure.gemConfiguration);
}


function addToFinalConfiguration(gems: GemType[], treasures: TreasureType[], value: number) {
    const deepCopyGems = gems.map(gem => ({ ...gem }));
    const deepCopyTreasures = treasures.map(treasure => {
        const usedGems = treasure.gemConfiguration;
        const usedSmallSlots = (usedGems ?? []).filter(g => !g.large).length;
        const usedLargeSlots = (usedGems ?? []).filter(g => g.large).length;

        return {
            ...treasure,
            smallSlots: Math.max(0, treasure.smallSlots - usedSmallSlots),
            largeSlots: Math.max(0, treasure.largeSlots - usedLargeSlots),
            gemConfiguration: usedGems ? [...usedGems] : undefined
        };
    });

    const fc: FinalConfigurationType = {
        gems: deepCopyGems,
        treasures: deepCopyTreasures,
        value: value
    };
    finalConfigurations.push(fc);
}