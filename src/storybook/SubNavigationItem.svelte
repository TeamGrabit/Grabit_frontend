<script>
	export let onClick;
	export let isActive;
	import { afterUpdate } from 'svelte';

	let activeCss;
	afterUpdate(() => {
		if(isActive) activeCss="SubNavigationItem--active";
		else activeCss='';
	})
</script>

<div class="SubNavigationItem {activeCss}" on:click={onClick}>
	{#if isActive}
		<div class="SubNavigationItem__active" />
	{/if}
	<slot />
</div>

<style lang="scss">
	.SubNavigationItem {
		box-sizing: border-box;
		padding: 1rem 1.5rem;
		width: 100%;
		text-align: center;
		background: inherit;
		position: relative;

		&--active {
			color: #568259; // TODO: green-dark컬러로 바꾸기
		}

		&:hover {
			cursor: pointer;
			filter: brightness(0.95);
		}


		&:first-child:not(:last-child) {
			margin-top: 1rem;
		}

		&:last-child:not(:first-child) {
			margin-bottom: 1rem;
		}
		&__active {
			width: 0.4rem;
			height: 2rem;
			background-color: #568259; // TODO: green-dark컬러로 바꾸기;
			position: absolute;
			top: 0.5rem;
		}
	}
</style>