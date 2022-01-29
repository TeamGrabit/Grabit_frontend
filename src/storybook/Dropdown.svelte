<script>
	export let open;
	export let right;

	let rightCss;

	if(right) rightCss = 'Dropdown--right';
</script>

{#if open}
	<div class="Dropdown {rightCss}">
		<slot />
	</div>
{/if}

<style lang="scss">
	.Dropdown{
		position: absolute;
		background: var(--main-white-color);
		box-shadow: 2px 2px 5px rgba(0, 0, 0, .3);
		z-index: 10;

		&--right {
			right: 0;
		}
	}
</style>