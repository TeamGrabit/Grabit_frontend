<script>
	export let isActive;
	import { Card } from '../storybook';
</script>

{#if isActive}
<div class="page">
	<Card>hi</Card>
</div>
{/if}

<style lang="scss">
	.page{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		padding-top: 6rem;
		width: 40rem;
	}
</style>
