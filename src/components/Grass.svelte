<script>
	export let grass_list;
	export let isBig;
	export let group_num;
	let color_level = 4;
</script>

<div class="box {isBig ? "big_box" : "grass_box"}">
	{#each grass_list as commit_count}
		{#if isBig}
			<!-- 팀 Grass -->
			<div class="grass grass_{Math.ceil(commit_count * color_level / group_num)}" />
		{:else}
			<!-- 개인 Grass -->
			{#if commit_count < 9}
				<div class="grass grass_{Math.ceil(commit_count / 2)}" />
			{:else}
				<!-- 해당 날짜의 커밋 횟수가 8번 이상이면 가장 진함 -->
				<div class="grass grass_4" />
			{/if}
		{/if}
	{/each}
</div>

<style lang="scss">
	.box{
		border: #BCBCBC solid 1.5px;
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
