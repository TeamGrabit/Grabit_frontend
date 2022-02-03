<script>
import {Button} from '../storybook';
import {Inputxt} from '../storybook'; 
import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
import "../common/colorVariable.css";

let challengename="";
let Description="";


function Save(){
	if(challengename=='')
		alert("이름을 입력해주세요.");
	else {												//store에 생성된 데이터 넘겨주기
		alert(challengename + "이 생성되었습니다."); 
		window.location.href = "http://localhost:5000"; //링크 나중에 수정해야 합니다!
	}
}

function Cancel(){
	alert("취소되었습니다.")
	window.history.back();
}
</script>


<GlobalNavigationBar />
<div class="Page">
	<div class="Content">
		<div class=title>Create New Challenge</div>
		<hr align=left class=hr />
		<div class=Sub_content>
			<div class=text>challenge name
				<span style="color:red;">*</span>
			</div>
			<Inputxt bind:bindvalue={challengename} maxlength=20 size=20 placeholder=''/>
			
			<div class=text>Description</div>

			<Inputxt bind:bindvalue={Description} size=80 placeholder=''/>
		</div>
		<hr align=left class=hr />
		<div class=Sub_content>
			<div class=Contain>
				<input type="radio" name="secure"checked="check">
				<img class="Image" src="images/public.png" alt="public_img" />
				<div>
					<div class=small_text>Public</div>
					<div class=explain_text>Anyone on the internet can see this Challenge!</div>
				</div>
			</div>

			<div class=Contain>
				<input type="radio" name="secure" align="middle">
				<img class="Image" src="images/private.png" alt="private_img" />
				<div>
					<div class=small_text>Private</div>
					<div class=explain_text>You choose who can see and join to this Challenge!</div>
				</div>
			</div>
		</div>
		<hr align=left class=hr />
		<div class=Sub_content>
			<Button 
				width='7rem'
				height='2.5rem'
				backgroundColor='var(--main-green-color)'
				onClick={Save}
			>	
				<div class=button_text>Create</div>
			</Button>

			<Button 
				width='7rem'
				height='2.5rem'
				backgroundColor='#E3E3E3'
				onClick={Cancel}
			>	
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
		padding: 1rem;
		padding-top: 6rem;
	}
	.Content{
		width: auto;
	}
	.Sub_content{
		margin-top:0.1rem;
	}
	.Contain{
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		margin-bottom: 0.5rem;
		align-items: center;
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
	.title{
    	font-size: 1.3rem;
    	margin-top: 1rem;
    	margin-bottom: 1rem;
		font-weight: bold;
	}
	.text{
		font-size: 1.1rem;
		margin-top:0.7rem;
    	margin-bottom:0.7rem;
	}
	.small_text{
		font-size: 0.9rem;
		margin-top:0.2rem;
    	margin-bottom:0.2rem;
	}
	.explain_text{
    	font-size: 0.6rem;
    	color:#8F8F8F;
	}
</style>