<script>
import Button from '../components/Button.svelte';
import Inputxt from '../components/Inputxt.svelte'; 
import Container from '../components/Container.svelte';
import "../common/colorVariable.css";
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
<div class="Page">
	<div class="Content">
		<div class=title_text>Create New Challenge</div>
		<hr align=left class=hr />
		<div class=Sub_content>
			<div class=subtitle_text>challenge name
				<span style="color:red;">*</span>
			</div>
			<Inputxt bind:value={challengename} maxlength=20 size=20/>
			
			<div class=subtitle_text>Description</div>

			<Inputxt bind:value={Description} size=80/>
		</div>
		<hr align=left class=hr />
		<div class=Sub_content>
			<div class=Contain>
				<input type="radio" name="secure"checked="check">
				<img class="Image" src="images/public.png" alt="public_img" />
				<div>
					<div class=common_text>Public</div>
					<div class=explain_text>Anyone on the internet can see this Challenge!</div>
				</div>
			</div>

			<div class=Contain>
				<input type="radio" name="secure" align="middle">
				<img class="Image" src="images/private.png" alt="private_img" />
				<div>
					<div class=common_text>Private</div>
					<div class=explain_text>You choose who can see and join to this Challenge!</div>
				</div>
			</div>
		</div>
		<hr align=left class=hr />
			<!-- on click은 이후에 수정하기 (지금 작동x)-->	
		<div class=Sub_content>
			<Button on:click={() => checkBlank(challengename)} width='7rem' height='2.5rem' backgroundColor='var(--main-green-color)'>
				<div class=button_text>Create</div>
			</Button>

			<Button on:click={() =>{}}  width='7rem' height='2.5rem' backgroundColor='#E3E3E3'> 
				<div class=button_text>Cancel</div>
			</Button>
		</div>
	</div>
</div>



<style lang="scss">
	.Page{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.Content{
		weight: auto;
		height: auto;
	}

	.Sub_content{
		margin-top:0.1rem;
	}

	.Contain{
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		margin-bottom: 0.5rem;
	}

	.Image{
		height: 100%;
		margin-left:0.5rem;
		margin-right:0.5rem;
	}

	.hr{
		border:none;
		height: 1px;
		width: 40rem;
		background: var(--line-gray-color);
		margin-top: 2rem;
		margin-bottom: 2rem;
		flex: 0 0 100%;
	}
</style>