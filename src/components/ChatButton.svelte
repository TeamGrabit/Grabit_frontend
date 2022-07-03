<script>
	import { onMount } from 'svelte';
	import { location } from 'svelte-spa-router';
	import { user } from '../store/user.js';
	import { challengeList } from '../store/challenge.js';

	let challenge_code = null;
	let chat_on = false;
	let isClicked = false;

	function onClick() {
		isClicked = !isClicked;
	}
	function chatOn(id) {
		chat_on = true;
		challenge_code = id-1;
	}
	function chatOff() {
		chat_on = false;
		challenge_code = null;
	}
	//페이지 url에 따른 채팅창 open : 추후 구현
	//onMount(() => {
	//	if ($location.split('/')[1] == "challenge"){
	//		challenge_code = $location.split('/')[2];
	//	};
	//})
	const chat_logs = [
		{id: 'user1', message: '내용1', createdAt: '22-07-03 16:11'},
		{id: 'user1', message: '내용2', createdAt: '22-07-03 16:11'},
		{id: 'tnghd5761', message: '내 메세지1', createdAt: '22-07-03 16:12'},
		{id: 'user1', message: '내용3', createdAt: '22-07-03 16:12'},
		{id: 'tnghd5761', message: '내 메세지2', createdAt: '22-07-03 16:12'},
		{id: 'user1', message: '내용4', createdAt: '22-07-03 16:14'},
		{id: 'user1', message: '내용5', createdAt: '22-07-03 16:15'},
		{id: 'tnghd5761', message: '내 메세지3', createdAt: '22-07-03 16:15'},
		{id: 'tnghd5761', message: '내 메세지4', createdAt: '22-07-03 16:16'}
	]
</script>

{#if isClicked}
	<div class="chat">
		<div class="chat_upper">
			<div class="chat_upper_home" on:click={chatOff}>←</div>
			<div class="close" on:click={onClick} />
		</div>
		{#if chat_on}
			<div class="chat_room">
				<div class="chat_room_upper">{$challengeList[challenge_code].title}</div>
				{#each log as chat_logs}
					<!--{#if log.id == }-->
				{/each}
				<div class="chat_room_body">채팅방</div>
			</div>
		{:else}
			<div class="chat_main">
				{#each $challengeList as challenge}
					<div class="chat_main_room" on:click={chatOn(challenge.id)}>
						<div>{challenge.title}</div>
						<div>last chat</div>
					</div>
				{/each}
			</div>
		{/if}
		<div></div>
	</div>
{:else}
	<div class="chat_btn" on:click={onClick}>
		<!--<div class="plus_icon">+</div>-->
	</div>
{/if}

<style lang="scss">
	.chat, .chat_btn{
		position: fixed;
		right: 5vw;
		bottom: 10vh;
	}
	.chat{
		width: 25rem;
		height: 35rem;
		max-width: 85vw;
		max-height: 80vh;
		padding: 0 0.5rem 0.5rem 0.5rem;
		background-color: white;
		border: 0.15rem solid #DDDDDD;
		border-radius: 1rem;
		&_upper{
			display: flex;
			flex-direction: row;
			font-size: 2.5rem;
			justify-content: right;
			padding-right: 0.5rem;
			&_home{
				cursor: pointer;
			}
		}
		.close:after {
			display: inline-block;
			content: "\00d7";
			cursor: pointer;
		}
		&_main{
			height: calc(100% - 2.5rem);
			overflow-y: overlay;
			&_room{
				margin-top: 0.5rem;
				margin-bottom: 0.5rem;
				padding: 0.5rem;
				background-color: #A6EDC0;
				height: 3rem;
				border: 1px solid #DDDDDD;
				border-radius: 1rem;
			}
		}
		&_room{
			height: calc(100% - 2.5rem);
			margin-top: 0.5rem;
			&_upper{
				height: 2rem;
				padding: 0.5rem;
				border-top-left-radius: 1rem;
				border-top-right-radius: 1rem;
				background-color: #42A968;
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
			&_body{
				height: calc(100% - 4.5rem);
				padding: 0.5rem;
				border-bottom-left-radius: 1rem;
				border-bottom-right-radius: 1rem;
				background-color: #A6EDC0;
			}
		}
	}
	.chat_btn{
		background-color: aquamarine;
		width: 5rem;
		height: 5rem;
		max-width: 10vw;
		max-height: 10vw;
		border-radius: 2.5rem;
		cursor: pointer;
	}
</style>