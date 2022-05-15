<script>
	export let isActive
</script>

{#if isActive}
<div class="page">
	ApproveMemeber
</div>
{/if}

<style lang="scss">
	.page{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		padding-top: 6rem;
	}
</style>
