<script>
	import { API_URL } from "../common/Variable.js";
	import { user } from '../store/user.js';
	import { onMount } from 'svelte';
	import { useEffect } from '../common/hook.js';
	import * as StompJs from '@stomp/stompjs';
	import SockJS from 'sockjs-client';
	export let challenge;
	
	let message = '';
	let client;
	let sub;

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
	};

	const onKeyPress = (e) => {
		if (e.charCode === 13) publish();
	};

	const connect = () => {
		client = new StompJs.Client({
			// webSocketFactory: () => new SockJS(`${API_URL}/stomp/chat/${challenge.id}`), // proxy를 통한 접속
			webSocketFactory: () => new SockJS(`${API_URL}/stomp/chat`), // 임시
			connectHeaders: {
				"auth-token": "spring-chat-auth-token",
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				sub = client.subscribe('/sub/chat', onReceive);
			},
			onStompError: (frame) => {
				console.error(frame);
			},
		});

		client.activate();
	};

	// const disconnect = () => {
	// 	client.deactivate();
	// };

	const onReceive = (message) => {
		const new_chat = JSON.parse(message.body);
		chat_logs = [...chat_logs, new_chat];
	};

	const publish = () => {
		if (!client.connected) {
			return;
		}
		const new_chat = JSON.stringify({
				id: $user?.githubId,
				message: message,
				createdAt: '22-07-14 16:11'
			});
		client.publish({
			destination: "/sub/chat",
			body: new_chat
		});

		message = "";
	};

	onMount(() => {
		connect();

		scrollDown();
	});

	useEffect(() => {
		scrollDown();
	}, () => [chat_logs])
</script>

<div class="chat_room">
	<div class="chat_room_upper">{challenge.name}</div>
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
	<input class="chat_room_write" on:keypress={onKeyPress} type="text" bind:value={message} />
	<button on:click={publish}>
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
			padding: 0 1rem 0.5rem 1rem;
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
