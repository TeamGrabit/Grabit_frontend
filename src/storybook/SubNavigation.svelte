<script>
</script>

<div class="SubNavigation">
	<slot />
</div>

<style lang="scss">
	.SubNavigation {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 8rem;
		margin-top: 15%;
		margin-right: 1rem;
		width: 16rem;
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		background: var(--main-white-color);
	}
</style>