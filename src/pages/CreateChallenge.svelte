<script>
	import { push, pop } from 'svelte-spa-router';
	import { Button, Input } from '../storybook'; 
	import { fetchPost } from '../common/fetch';
	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';

	let challengename="";
	let description="";
	let isPrivate=false;

	async function sendToServer()
	{
		const data = await fetchPost('challenges', {'name': challengename, 'description':description, 'isPrivate': isPrivate})
		return data
	}
	function save(){
		if(challengename=='')
			alert("이름을 입력해주세요.")
		else {
			sendToServer()
			alert("챌린지 생성 성공!.")
			push('/')
		}
	}
	function cancel(){
		alert("취소되었습니다.")
		pop()
	}
</script>

<GlobalNavigationBar />
<div class="page">
	<div class="content">
		<div class=title>Create New Challenge</div>
		<hr align=left class=hr />
		<div class=sub_content>
			<div class=text>Challenge name
				<span style="color:red;">*</span>
			</div>
			<Input bind:bindvalue={challengename} maxlength=20 size=20/>
			
			<div class=text>Description</div>

			<Input bind:bindvalue={description} size=80/>
		</div>
		<hr align=left class=hr />
		<div class=sub_content>
			<div class=contain>
				<input type="radio" name="secure"checked="check" bind:group={isPrivate} value={false}>
				<img class="image" src="images/public.png" alt="public_img" />
				<div>
					<div class=small_text>Public</div>
					<div class=explain_text>Anyone on the internet can see this Challenge!</div>
				</div>
			</div>
			<div class=contain>
				<input type="radio" name="secure" align="middle" bind:group={isPrivate} value={true}>
				<img class="image" src="images/private.png" alt="private_img" />
				<div>
					<div class=small_text>Private</div>
					<div class=explain_text>You choose who can see and join to this Challenge!</div>
				</div>
			</div>
		</div>
		<hr align=left class=hr />
		<div class=sub_content>
			<Button 
				width='7rem'
				height='2.5rem'
				backgroundColor='var(--main-green-color)'
				onClick={save}
			>	
				<div class=button_text>Create</div>
			</Button>

			<Button 
				width='7rem'
				height='2.5rem'
				backgroundColor='#E3E3E3'
				onClick={cancel}
			>	
				<div class=button_text>Cancel</div>
			</Button>
		</div>
	</div>
</div>

<style lang="scss">
	.page{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		padding-top: 6rem;
	}
	.content{
		width: auto;
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
		width: 40rem;
		background: var(--border-color);
		margin-top: 2rem;
		margin-bottom: 2rem;
		flex: 0 0 100%;
	}
	.title{
    	font-size: 1.3rem;
    	margin-top: 1rem;
    	margin-bottom: 1rem;
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
