<script>
	import { push, pop } from 'svelte-spa-router';
	import { Button, Input } from '../storybook'; 


	export let isActive;

	let challengename="";
	let description="";	//임시 데이터.

	function save(){
		if(challengename=='')
			alert("이름을 입력해주세요.");
		else {												//store에 생성된 데이터 넘겨주기
			alert(challengename + "이 생성되었습니다."); 
			push('/');
		}
	}
	function cancel(){
		alert("취소되었습니다.")
		pop();
	}
</script>

{#if isActive}
<div class="page">
	<div class="content">
		<div class=title>Settings</div>
		<div class=sub_content>
			<div class=text>Challenge name</div>
			<span>
				<Input bind:bindvalue={challengename} maxlength=20 size=20/>
				<Button 
					width='8rem'
					height='2.5rem'
					backgroundColor='var(--main-green-color)'
					onClick={save}
				>	
					<div class=button_text>Rename</div>
				</Button>
			</span>
			
			<div class=text>Description</div>

			<Input bind:bindvalue={description} size=80/>
		</div>
		<hr align=left class=hr />
		<div class=sub_content>
			<div class=contain>
				<input type="radio" name="secure"checked="check">
				<img class="image" src="images/public.png" alt="public_img" />
				<div>
					<div class=small_text>Public</div>
					<div class=explain_text>Anyone on the internet can see this Challenge!</div>
				</div>
			</div>

			<div class=contain>
				<input type="radio" name="secure" align="middle">
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
				width='8rem'
				height='2.5rem'
				backgroundColor='var(--main-green-color)'
				onClick={save}
			>	
				<div class=button_text>Change</div>
			</Button>

			<Button 
				width='8rem'
				height='2.5rem'
				backgroundColor='#FAE5E5'
				onClick={cancel}
			>	
				<div class=button_text>Delete</div>
			</Button>
		</div>
	</div>
</div>
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
