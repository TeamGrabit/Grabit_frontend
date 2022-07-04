<script>
	import { user } from '../store/user.js';
	import { onMount } from 'svelte';
	import { useEffect } from '../common/hook.js';
	export let title;
	
	//const socket = new WebSocket('wss://localhost:8080/chat');
	//socket.addEventListener('open', function (event) {
	//	console.log("It's open");
	//});

	let message = '';
	let chat_logs = [
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
	
	const scrollDown = () => {
		var objDiv = document.getElementById("chat_room_body");
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	onMount(() => {
		scrollDown();
	})

	const sendMessage = (message) => {
		const new_chat = {
			id: $user?.githubId,
			message: message,
			createdAt: 'now'
		}
		chat_logs = [...chat_logs, new_chat];
		//if (socket.readyState <= 1) {
		//	socket.send(message);
		//}
	}
	function onSendMessage() {
		if (message.length > 0) {
			sendMessage(message);
			message = "";
		}
	}

	useEffect(() => {
		scrollDown();
		console.log(chat_logs);
	}, () => [chat_logs])
</script>

<div class="chat_room">
	<div class="chat_room_upper">{title}</div>
	<div id="chat_room_body" class="chat_room_body">
		{#each chat_logs as log}
			{#if log.id == $user?.githubId}
				<div class="chat chat_my">
					<div>나</div>
					<div class="message message_my">{log.message}</div>
				</div>
			{:else}
			<div class="chat chat_other">
					<div>{log.id}</div>
					<div class="message message_other">{log.message}</div>
				</div>
			{/if}
		{/each}
	</div>
	<input class="chat_write" type="text" bind:value={message} />
	<button on:click={onSendMessage}>
		Send Message
	</button>
</div>

<style lang="scss">
	.chat_room{
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
			padding: 0 0.5rem 0.5rem 0.5rem;
			height: calc(100% - 7.5rem);
			background-color: #A6EDC0;
			overflow-y: overlay;
		}
		&_write{
			height: 3rem;
			padding: 0.5rem;
			background-color: white;
			border-bottom-left-radius: 1rem;
			border-bottom-right-radius: 1rem;
		}
	}
	.chat{
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		&_my{
			align-items: end;
		}
		&_other{
			align-items: baseline;
		}
	}
	.message{
		border-radius: 0.5rem;
		padding: 0.25rem;
		margin-top: 0.25rem;
		max-width: 80%;
		&_my{
			background-color: yellow;
		}
		&_other{
			background-color: white;
		}
	}
</style>
