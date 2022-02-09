<script>
</script>

<div class="SubNavigation">
	<slot />
</div>

<style lang="scss">
	.SubNavigation {
		display: flex;
		position: absolute;
		flex-direction: column;
		align-items: center;
		left: 4rem;
		top: 30%;
		width: 16rem;
		border: 1px solid var(--line-gray-color);
		border-radius: 1rem;
		background: var(--main-white-color);
	}
</style>