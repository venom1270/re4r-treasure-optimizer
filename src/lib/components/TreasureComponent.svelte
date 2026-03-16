<script lang="ts">
	import type { GemType } from '$lib/types/GemType';
	import type { TreasureType } from '$lib/types/TreasureType';

	interface TreasureComponentProps {
		treasure: TreasureType;
		input: boolean;
	}

	let { treasure = $bindable(), input }: TreasureComponentProps = $props();

	function getSlotVisual(gem: GemType): string {
		switch (gem.name) {
			case 'Ruby':
				return '🔴';
			case 'Sapphire':
				return '🔵';
			case 'Yellow Diamond':
				return '🟡';
			case 'Emerald':
				return '🟩';
			case 'Alexandrite':
				return '🟪';
			case 'Red Beryl':
				return '🟥';
			default:
				return '';
		}
	}
</script>

<div class="container">
	<img class="treasure-image" src={treasure.imageSrc} alt={treasure.name} />
	<div class="treasure-slots">
		{#each treasure.gemConfiguration as config}
			{getSlotVisual(config)}
		{/each}
		{#each { length: treasure.smallSlots }}
			⏺
		{/each}
		{#each { length: treasure.largeSlots }}
			⬜
		{/each}
	</div>
	<span class="treasure-name">{treasure.name}</span>
	<span class="treasure-value">({treasure.baseValue} ptas.)</span>
	{#if input}
		<span class="treasure-quantity">
			<input type="number" min="0" max="100" bind:value={treasure.quantity} />
		</span>
	{/if}
</div>

<style>
	.container {
		margin: 10px;
		position: relative;
		width: min(140px, 100%);
		min-height: 260px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		background: linear-gradient(180deg, #101216 0%, #08090d 100%);
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.55);
		text-align: center;
		transition:
			box-shadow 500ms ease,
			outline 500ms ease;
	}

	.container:hover {
		box-shadow:
			0 18px 30px rgba(0, 0, 0, 0.7),
			0 0 0 4px rgba(255, 255, 255, 0.25);
		outline: 2px solid rgba(255, 255, 255, 0.85);
		outline-offset: 0;
	}

	.treasure-image {
		width: 100%;
		max-width: 160px;
		height: auto;
		border-radius: 4px;
		object-fit: contain;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
	}

	.treasure-slots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
		font-size: 1.1rem;
		line-height: 1;
		color: rgba(255, 255, 255, 0.9);
	}

	.treasure-name {
		display: block;
		font-weight: 700;
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.92);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.treasure-value {
		display: block;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
	}
</style>
