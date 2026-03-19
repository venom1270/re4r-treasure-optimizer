<script lang="ts">
	import type { GemType } from '$lib/types/GemType';
	import { formatNumber } from '$lib/util/formatNumber';

	interface GemComponentProps {
		gem: GemType;
		input: boolean;
	}

	let { gem = $bindable(), input }: GemComponentProps = $props();
</script>

<div class="item">
	<img class="gem-image" src={gem.imageSrc} alt={gem.name} />
	<span class="gem-name">{gem.symbol}{gem.name}</span>
	<span class="gem-value">({formatNumber(gem.baseValue)} ptas.)</span>
	<span class="gem-quantity">
		{#if input}
			<input type="number" min="0" max="100" bind:value={gem.quantity} />
		{:else}
			{gem.quantity}
		{/if}
	</span>
	{#if !input}
		<span class="gem-value-final">{formatNumber(gem.baseValue * gem.quantity)} ptas.</span>
	{/if}
</div>

<style>

	.gem-image {
		width: 100%;
		max-width: 160px;
		height: auto;
		border-radius: 4px;
		object-fit: contain;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
	}

	.gem-name {
		display: block;
		font-weight: 700;
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.92);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	}

	.gem-value {
		display: block;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.gem-value-final {
		display: block;
		font-size: 0.85rem;
		font-weight: bold;
		color: var(--color-green);
	}
</style>
