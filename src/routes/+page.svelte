<script lang="ts">
	import TreasureComponent from '$lib/components/TreasureComponent.svelte';
	import { treasures } from './treasures';
	import { gems } from './gems';
	import GemComponent from '$lib/components/GemComponent.svelte';
	import { alogorithm } from './algorithm_old2';
	import type { FinalConfigurationType } from '$lib/types/FinalConfigurationType';
	import { formatNumber } from '$lib/util/formatNumber';
	import { tick } from 'svelte';

	// TODO: looks good background: https://www.vecteezy.com/video/64896420-dust-floating-particles-with-transparent-background

	let finalConfigurations: FinalConfigurationType[] = $state([]);
	let showCount = $state(1);
	const SHOW_INCREASE = 1;

	async function calculate() {
		finalConfigurations = alogorithm(gems, treasures);
		showCount = 1;

		await tick();
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	async function increaseShowCount() {
		showCount = Math.min(showCount + SHOW_INCREASE, finalConfigurations.length);

		await tick();
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}
</script>

<h1 class="title">
	<span class="red-color">R</span>E4<span style="color: gray; font-size: 0.75em">R</span> <span class="red-color">T</span>reasure
	<span class="red-color">O</span>ptimizer
</h1>

<p>
	<a target="#" href="https://steamcommunity.com/sharedfiles/filedetails/?id=2956317077"
		>Credit to this Steam guide for all info in one place!</a
	>
</p>
<p>
	<a
		target="#"
		href="https://www.desktophut.com/live-wallpaper/Smoke-Black-Screen-Background-For-Edits-Royalty-Free-Stock-Footage-Template-Video-Background"
		>And this for the background!</a
	>
</p>

<button class="calculate-button" onclick={calculate}>Calculate optimal configuration</button>

<div class="container">
	<div class="container-left">
		<div class="gem-list">
			{#each gems as _, i}
				<GemComponent bind:gem={gems[i]} input={true} />
			{/each}
		</div>
	</div>

	<div class="container-right">
		<div class="treasure-list">
			{#each treasures as _, j}
				<TreasureComponent bind:treasure={treasures[j]} input={true} />
			{/each}
		</div>
	</div>
</div>


<div class="configurations">
	{#each finalConfigurations.slice(0, showCount) as c}
		<hr/>
		<div class="configuration">
			<div class="configuration-value">{formatNumber(c.value)} ptas.</div>
			<div class="configuration-gems">
				{#each c.gems as gem}
					{#if gem.quantity > 0}
						<GemComponent {gem} input={false} />
					{/if}
				{/each}
			</div>
			<div class="configuration-treasures">
				{#each c.treasures as treasure}
					<TreasureComponent {treasure} input={false} />
				{/each}
			</div>
		</div>
	{/each}

	{#if showCount < finalConfigurations.length}
		<button class="show-more" onclick={increaseShowCount}> Show more </button>
	{/if}
</div>

<style>
	:global(body) {
		color: white;
		background: black;
		/*font-family: 'Helvetica Neue LT W1G', sans-serif;*/
		font-family: 'DINNextW1G-Regular';
	}

	hr {
		width: 1400px;
		max-width: 100%;
		margin: 0 auto;
		border: none;
		border-top: 1px solid #ccc;
	}

	.container {
		display: flex;
		gap: 50px;
    	justify-content: center;
		align-content: center;
		padding-top: 50px;
		padding-bottom: 30px;
	}

	.container-left, .container-right {
		display: flex;
		width:1000px
	}

	.container-left {
		justify-content: right;
	}

	.treasure-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 800px;
		/*background-color: gray;*/
		align-items: flex-start;
		align-content: flex-start;
	}

	.gem-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 600px;
		/*background-color: gray;*/
		align-items: flex-start;
		align-content: flex-start;
	}

	.configurations {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.configuration {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.08);
		margin: 50px;
		padding: 50px;
		max-width: 1600px;
	}

	.configuration-value {
		font-size: 28px;
		font-weight: bold;
		color: var(--color-green);
		padding-bottom: 20px;
	}

	.configuration-gems {
		display: flex;
		justify-content: center;
	}

	.configuration-treasures {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

	}

	.title {
		font-size: 3rem;
		text-align: center;
		margin: 20px 0 0;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-weight: 800;
		color: rgba(255, 255, 255, 0.95);
		text-shadow: 0 0 6px var(--color-red);
	}

	p {
		text-align: center;
		margin: 0.35rem 0;
	}

	p a {
		color: var(--color-red);
		text-decoration: none;
		transition:
			color 0.2s ease,
			text-shadow 0.2s ease;
	}

	p a:hover {
		color: rgba(255, 255, 255, 1);
		text-shadow: 0 0 10px var(--color-red);
	}




	.show-more {
		margin: 0 50px 50px;
		padding: 10px 20px;
		font-size: 16px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.1);
		color: white;
		cursor: pointer;
		max-width: 400px;
		min-width: 200px;
		transition: background 0.2s ease;
	}

	.show-more:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.calculate-button {
		display: block;
		margin: 30px auto;
		padding: 14px 26px;
		font-size: 16px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
		background: var(--color-red);
		border: 1px solid rgba(255, 255, 255, 0.5);
		cursor: pointer;
		box-shadow: 0 0 0 var(--color-red);
		transition:
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.calculate-button:hover {
		background: var(--color-red);
		box-shadow: 0 0 18px var(--color-green);
	}
</style>
