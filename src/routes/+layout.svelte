<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	let video: HTMLVideoElement;

	onMount(() => {
		//video.playbackRate = 0.8; // 0.5 = half speed
	});
</script>

<video bind:this={video} autoplay muted loop playsinline class="bg-video">
	<source src="/background.mp4" type="video/mp4" />
</video>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	.bg-video {
		position: fixed;
		top: 0;
		left: 0;

		width: 100vw;
		height: 100vh;

		object-fit: cover;

		z-index: -1;
		pointer-events: none;
		filter: opacity(30%);
	}

	main {
		position: relative;
		z-index: 1;
	}
</style>
