<script>
	import { push } from 'svelte-spa-router';
	
	function moveChallengelist(){
		push(`/challengelist`);
	}

</script>

<div class="gnb">
	<div class="gnb_inner">
		<div class="gnb_menu">
			My Challenges
		</div>
		<div class="gnb_menu" on:click={moveChallengelist}>
			View Other Challenges
		</div>
	</div>
</div>
<style>
	.gnb{
		position: absolute;
		height: 5rem;
		width: 75rem;
		min-width: 100%;
		border-bottom: #DDDDDD solid 1px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.gnb_inner{
		padding-top: 1.875rem;
		padding-right: 1.25rem;
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.gnb_menu{
		padding-left: 2.5rem;
		font-size: 1rem;
		font-weight: bold;
	}
</style>