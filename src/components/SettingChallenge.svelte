<script>
	import { onMount } from 'svelte';
	import { push, pop } from 'svelte-spa-router';
	import { Button, Input, Loader } from '../storybook';

	import { notifications } from '../store/notifications.js';
	import Toast from '../components/Toast.svelte';

	import { getChallenge, editChallenge, deleteChallenge } from '../store/challenge.js'


	export let isActive;
	export let params;

	let challengeData = null;
	let name = '';
	let description = '';
	let secure = "public";
	let leader = '';

	onMount(async() => {
		challengeData = await getChallenge(params.id);
		name = challengeData.name;
		description = challengeData.description;
		leader = challengeData.leader;
		secure = challengeData.isPrivate ? 'private' : 'public';
	})

	const onClickSave = () => {
		const isPrivate = secure === 'private';
		editChallenge(params.id, { name, description, isPrivate, leader }).then(() => {
			notifications.send('저장되었습니다.');
		})
	}
	const onClickDelete = () => {
		deleteChallenge(params.id).then(() => {
			notifications.send('삭제되었습니다.');
		})
	}
</script>

{#if isActive}
	{#if !challengeData}
		<Loader />
	{:else}
		<Toast/>
		<div class="page">
			<div class="content">
				<div class=title>Settings</div>
				<div class=sub_content>
					<div class=text>Challenge name</div>
					<span>
						<Input bind:bindvalue={name} maxlength=20 size=20/>
					</span>
					
					<div class=text>Description</div>

					<Input bind:bindvalue={description} size=70/>
				</div>
				<hr align=left class=hr />
				<div class=sub_content>
					<div class=contain>
						<input type="radio" bind:group={secure} name="secure" value="public">
						<img class="image" src="images/public.png" alt="public_img" />
						<div>
							<div class=small_text>Public</div>
							<div class=explain_text>Anyone on the internet can see this Challenge!</div>
						</div>
					</div>

					<div class=contain>
						<input type="radio" bind:group={secure} name="secure" align="middle" value="private">
						<img class="image" src="images/private.png" alt="private_img" />
						<div>
							<div class=small_text>Private</div>
							<div class=explain_text>You choose who can see and join to this Challenge!</div>
						</div>
					</div>
				</div>
				<hr align=left class=hr />
				<div class="sub_content button_group">
					<Button 
						width='8rem'
						height='2.5rem'
						backgroundColor='var(--main-green-color)'
						onClick={onClickSave}
					>	
						<div class=button_text>Save</div>
					</Button>

					<Button 
						width='8rem'
						height='2.5rem'
						backgroundColor='#FAE5E5'
						onClick={onClickDelete}
					>	
						<div class=button_text>Delete</div>
					</Button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	.page{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		padding-top: 6rem;
	}
	.content{
		width: 40rem;
		margin-bottom: 1.5rem;
	}
	.sub_content{
		margin-top:0.1rem;
	}
	.contain{
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		margin-bottom: 0.5rem;
		align-items: center;
	}
	.image{
		height: 100%;
		margin-left:0.5rem;
		margin-right:0.5rem;
	}
	.hr{
		border:none;
		height: 1px;
		background: var(--border-color);
		margin-top: 2rem;
		margin-bottom: 2rem;
		flex: 0 0 100%;
	}
	.title{
    	font-size: 1.3rem;
    	margin-top: 1rem;
    	margin-bottom: 2rem;
		font-weight: bold;
	}
	.text{
		font-size: 1.0rem;
		margin-top:0.7rem;
    	margin-bottom:0.7rem;
		font-weight: 600;
	}
	.small_text{
		font-size: 0.9rem;
		margin-top:0.2rem;
    	margin-bottom:0.2rem;
	}
	.explain_text{
    	font-size: 0.6rem;
    	color:var(--gray-color);
	}
</style>
