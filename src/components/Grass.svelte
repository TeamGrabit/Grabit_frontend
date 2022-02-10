<script>
	export let grass_list;
	export let isBig;
</script>

<div class="box {isBig ? "big_box" : "grass_box"}">
	{#each grass_list as grass}
		{#if grass === 0}
			<div class="grass grass_0" />
		{:else if grass === 1}
			<div class="grass {isBig ? "grass_1" : "grass_2"}" />
		{:else if grass === 2}
			<div class="grass grass_2" />
		{:else if grass === 3}
			<div class="grass grass_3" />
		{:else if grass === 4}
			<div class="grass grass_4" />
		{/if}
	{/each}
</div>

<style lang="scss">
	.box{
		border: #AAAAAA solid 2px;
		border-radius: 0.625rem;
		padding: 1%;
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(7, 11%);
		grid-template-columns: repeat(52, 1.3%);
		row-gap: 4%;
		column-gap: 0.6%;
		
		.grass{
			display: inline-block;
			border-radius: 2px;
		}
		.grass_0{ background-color: #EDEDED; }
		.grass_1{ background-color: #A6EDC0; }
		.grass_2{ background-color: #6FD093; }
		.grass_3{ background-color: #42A968; }
		.grass_4{ background-color: #217D43; }
	}
	.grass_box{
		height: 6rem;
	}
	.big_box{
		height: 10rem;
	}
</style>
