<script>
	let isClicked = false;
	function onClick() {
		isClicked = !isClicked;
	}
</script>

{#if isClicked}
	<div class="chat_system" on:click={onClick}>켜짐</div>
{:else}
	<div class="chat_btn" on:click={onClick}>
		<!--<div class="plus_icon">+</div>-->
	</div>
{/if}

<style lang="scss">
	.chat_system{
		position: fixed;
		right: 5vw;
		bottom: 10vh;
		width: 10rem;
		height: 20rem;
		border: 1.5px solid #DDDDDD;
	}
	.chat_btn{
		position: fixed;
		right: 5vw;
		bottom: 10vh;
		background-color: aquamarine;
		max-width: 10vw;
		max-height: 10vw;
		width: 5rem;
		height: 5rem;
		border-radius: 2.5rem;
		cursor: pointer;
	}
</style>