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
	<div class="image-container">
		<img class="gem-image" src={gem.imageSrc} alt={gem.name} draggable="false" />

		{#if input}
			<input class="gem-quantity-input" type="number" min="0" max="100" bind:value={gem.quantity} />
		{:else}
			<span class="gem-quantity"> {gem.quantity} </span>
		{/if}
	</div>
	<span class="gem-name">{gem.symbol}{gem.name}</span>
	<span class="gem-value">({formatNumber(gem.baseValue)} ptas.)</span>

	{#if !input}
		<span class="gem-value-final">{formatNumber(gem.baseValue * gem.quantity)} ptas.</span>
	{/if}
</div>

<style>
	.gem-image {
		width: 100%;
		max-width: 160px;
		height: auto;
		display: block;
		/*border-radius: 4px;*/
		object-fit: contain;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
	}

	.image-container {
		position: relative;
	}

	.gem-quantity {
		position: absolute;
		bottom: 0;
		right: 0;
		color: white;
		background: var(--quantity-background);
		width: var(--quantity-size);
		font-size: 1.2rem;
		height: var(--quantity-size);
		line-height: var(--quantity-size);
		font-weight: bold;
	}

	.gem-quantity-input {
		color: white;
		background: var(--quantity-background);
		border: none;
		text-align: right;
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
		text-align: center;
		position: absolute;
		width: var(--quantity-size);
		height: var(--quantity-size);
		bottom: 0;
		right: 0;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: 0;
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
