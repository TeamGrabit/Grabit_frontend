<script>

</script>

<div class="container_outside">
	<div class="container">
		<slot />
	</div>
</div>

<style lang="scss">
	.container_outside{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.container{
			width: 75rem;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
