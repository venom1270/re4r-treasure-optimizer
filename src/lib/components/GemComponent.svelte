<script lang="ts">
	import type { GemType } from '$lib/types/GemType';

	interface GemComponentProps {
		gem: GemType;
		input: boolean;
	}

	let { gem = $bindable(), input }: GemComponentProps = $props();
</script>

<div class="container">
	<img class="gem-image" src={gem.imageSrc} alt={gem.name} />
	<span class="gem-name">{gem.symbol}{gem.name}</span>
	<span class="gem-value">({gem.baseValue} ptas.)</span>
	<span class="gem-quantity">
		{#if input}
			<input type="number" min="0" max="100" bind:value={gem.quantity} />
		{:else}
			{gem.quantity}
		{/if}
	</span>
	{#if !input}
		<span class="gem-value-final">{gem.baseValue * gem.quantity} ptas.</span>
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
