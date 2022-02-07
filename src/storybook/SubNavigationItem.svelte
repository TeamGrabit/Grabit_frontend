<script>
</script>

<div class="SubNavigationItem">
	<slot />
</div>

<style lang="scss">
	.SubNavigationItem {
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
		text-align: center;
		background: inherit;

		&:hover {
			cursor: pointer;
			filter: brightness(0.95);
		}

		&:first-child {
			border-radius: inherit;
		}

		&:first-child:not(:last-child) {
			border-radius: 5px 5px 0 0;
		}

		&:last-child:not(:first-child) {
			border-radius: 0 0 5px 5px;
		}
	}
</style>