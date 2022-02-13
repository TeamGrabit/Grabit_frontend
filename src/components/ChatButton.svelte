<script>
	import { onMount } from 'svelte';
	import { location } from 'svelte-spa-router';
	
	let challenge_code = null;
	let isClicked = false;
	function onClick() {
		isClicked = !isClicked;
	}
	onMount(() => {
		if ($location.split('/')[1] == "challenge"){
			challenge_code = $location.split('/')[2];
		};
	})
</script>

{#if isClicked}
	<div class="chat">
		<div class="chat_upper">
			<div class="close" on:click={onClick} />
		</div>
		<div>location : {$location}</div>
		{#if challenge_code}
			<div>{challenge_code} 번의 채팅방</div>
		{:else}
			<div>채팅 메인	</div>
		{/if}
		<div>{console.log($location.split('/'))}</div>
	</div>
{:else}
	<div class="chat_btn" on:click={onClick}>
		<!--<div class="plus_icon">+</div>-->
	</div>
{/if}

<style lang="scss">
	.chat{
		position: fixed;
		right: 5vw;
		bottom: 10vh;
		width: 25rem;
		height: 35rem;
		max-width: 85vw;
		max-height: 80vh;
		background-color: white;
		border: 0.15rem solid #DDDDDD;
		border-radius: 1rem;

		.close{
			float: right;
			margin-right: 0.5rem;
			&:after {
				display: inline-block;
				content: "\00d7";
				font-size: 2.5rem;
				cursor: pointer;
			}
		}
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