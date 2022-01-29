<script>
	export let onClick;
</script>

<div class="DropdownItem" on:click={onClick}>
	<slot />
</div>

<style lang="scss">
	.DropdownItem{
		padding: 0.5rem 1rem;
		white-space: nowrap;
		background-color: inherit;

		transition: all 0.2s;
		
		&:hover {
			cursor: pointer;
			filter: brightness(0.95);
		}
	}
</style>