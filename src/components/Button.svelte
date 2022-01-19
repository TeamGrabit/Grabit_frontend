<script>
	export let width;
	export let height;
	export let backgroundColor;
</script>

<!-- TODO: Onclick연결 -->
<button
	class="Button"
	style="--width: {width};
	--height: {height};
	--backgroundColor: {backgroundColor}"
>
	<slot />
</button>

<style lang="scss">
	.Button {
		width: var(--width);
		height: var(--height);
		border-radius: 6px;
		cursor: pointer;
		background-color: var(--backgroundColor);
	}
	.Button:hover {
		filter: brightness(0.9);
	}
	.Button:active {
		background-color: var(--backgroundColor);
		filter: brightness(0.8);
	}
</style>