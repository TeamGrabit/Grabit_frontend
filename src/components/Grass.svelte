<script>
	export let grass_list;
</script>

<div class=grass_box>
	{#each grass_list as c}
		{#if c === 0}
			<div class="grass_emp" />
		{:else}
			<div class="grass_fill" />
		{/if}
	{/each}
</div>

<style>
	.grass_box{
		border: #AAAAAA solid 2px;
		border-radius: 0.625rem;
		height: 7.5rem;
		padding: 1%;
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(7, 10%);
		grid-template-columns: repeat(52, 1.2%);
		row-gap: 5%;
		column-gap: 0.7%;
	}
	.grass_emp, .grass_fill{
		/*width: 1%;*/
		display: inline-block;
	}
	.grass_emp{
		background-color: #AAAAAA;
	}
	.grass_fill{
		background-color: #96E6B3;
	}
</style>