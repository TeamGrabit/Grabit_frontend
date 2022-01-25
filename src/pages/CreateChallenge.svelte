<script>
import Button from '../components/Button.svelte';
import "../common/text.css";

let challengename='';
let Description='';

function checkBlank(challengename){
	if(challengename=='')
		alert("이름을 입력해주세요.");
	else //데이터 넘겨주기
		alert(challengename + "이 생성되었습니다."); 
}
</script>

<div class="Grid">
	<div class=--title-text>Create New Challenge</div>

	<div class=sub_grid>
		<div class=--subtitle-text>challenge name
			<span style="color:red;">*</span>
		</div>
		<input type="text" bind:value={challengename} maxlength=20 size=20>
		
		<div class=--subtitle-text>Description</div>

		<input type="text" bind:value={Description} size=80>
	</div>

	<div class=sub_grid>
		<div class=contain>
			<input type="radio" name="secure"checked="check">
			<img class="logo" src="images/public.png" alt="public_img" />
			<div>
				<div class=--common-text>Public</div>
				<div class=--explain-text>Anyone on the internet can see this Challenge!</div>
			</div>
		</div>

		<div class=contain>
			<input type="radio" name="secure">
			<img class="logo" src="images/private.png" alt="private_img" />
			<div>
				<div class=--common-text>Private</div>
				<div class=--explain-text>You choose who can see and join to this Challenge!</div>
			</div>
		</div>
	</div>


		<!-- on click은 이후에 수정하기 (지금 작동x)-->	
	<div class=sub_grid>
		<Button on:click={() => checkBlank(challengename)} width='7rem' height='2.5rem' backgroundColor='var(--main-green-color)'>
			<div class=--button-text>Create</div>
		</Button>

		<Button on:click={() =>{}}  width='7rem' height='2.5rem' backgroundColor='#E3E3E3'> 
			<div class=--button-text>Cancle</div>
		</Button>
	</div>
</div>

<style lang="scss">

	input[type=text]{
			height: 1.9rem;
			border: solid 1.2px 'var(--line-gray-color)';
			border-radius: 10px;

	}
	input:focus{
		outline:none;
	}
	.logo{
		height: 100%;
		margin-left:0.5rem;
		margin-right:0.5rem;
	}
	.Grid{
		display : flex;
		padding-left:20%;
		padding-right:20%;
		flex-direction: column;
	}
	.sub_grid{
		margin-top:0.1rem;
		margin-bottom:2rem;
	}
	.contain{
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		margin-bottom: 0.5rem;
	}

</style>