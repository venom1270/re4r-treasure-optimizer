<script lang="ts">
	import TreasureComponent from '$lib/components/TreasureComponent.svelte';
	import { treasures } from './treasures';
	import { gems } from './gems';
	import GemComponent from '$lib/components/GemComponent.svelte';
	import { alogorithm } from './algorithm';
	import type { FinalConfigurationType } from '$lib/types/FinalConfigurationType';

	let finalConfigurations: FinalConfigurationType[] = $state([]);

	function calculate() {
		finalConfigurations = alogorithm(gems, treasures);
	}
</script>

<h1>RE4 treasure optimizer</h1>

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

<button onclick={calculate}>Calculate optimal configuration</button>

<div class="container">
	<div class="gem-list">
		{#each gems as _, i}
			<GemComponent bind:gem={gems[i]} input={true} />
		{/each}
	</div>

	<div class="treasure-list">
		{#each treasures as _, j}
			<TreasureComponent bind:treasure={treasures[j]} input={true} />
		{/each}
	</div>
</div>

<div class="configurations">
	{#each finalConfigurations.slice(0, 5) as c}
		<div class="configuration">
			<div class="configuration-value">{c.value} ptas.</div>
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
</div>

<style>
	:global(body) {
		color: white;
		background: black;
	}

	.container {
		display: flex;
		gap: 50px;
		justify-content: space-between;
		padding-top: 50px;
		padding-left: 100px;
		padding-right: 100px;
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

	.configuration {
		display: flex;
		flex-direction: column;
		background-color: rgba(255, 255, 255, 0.1);
		margin: 10px;
	}

	.configuration-value {
		font-size: 24px;
		font-weight: bold;
	}

	.configuration-gems {
		display: flex;
	}

	.configuration-treasures {
		display: flex;
	}
</style>
