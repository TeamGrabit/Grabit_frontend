<script>
	export let width;
	export let height;
	export let backgroundColor;
	export let onClick;
</script>

<!-- TODO: Onclick연결 -->
<button
	class="Button"
	style="
		--width: {width || 'fit-content'};
		--height: {height || 'fit-content'};
		--backgroundColor: {backgroundColor || 'white'}
	"
	on:click={onClick}
>
	<slot />
</button>

<style lang="scss">
	.Button {
		width: var(--width);
		height: var(--height);
		background-color: var(--backgroundColor);
		border-radius: 6px;
		cursor: pointer;

		transition: all 0.2s;
	}
	.Button:hover {
		filter: brightness(0.95);
	}
	.Button:active {
		background-color: var(--backgroundColor);
		filter: brightness(0.85);
	}
</style>