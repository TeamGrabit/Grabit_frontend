<script>
	import {link, push} from 'svelte-spa-router'
	import Gnb from '../components/GNB.svelte';

	let user_id = "grabit_123";
	let challenge_list = [
		{num: 1, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"},
		{num: 2, name: "My Private Challenge", intro: "이 챌린지는 내가 관리하는 챌린지다!!"},
		{num: 3, name: "No.3", intro: "누가 넘바 쓰리래, 나 넘바 투야!"},
	]
	let row_length = parseInt(challenge_list.length / 2) + 1;
	console.log(row_length);
</script>

<div class="home">
	<Gnb />
	<div class="overview">
		<div class="profile">
			<div class="profile_img" />
			<div class="profile_id">{user_id}</div>
			<div class="edit_btn">Edit profile</div>
		</div>
		<div class="content">
			<div class="pinned">
				<div class="content_title">즐겨찾는 챌린지</div>
				<div class="box_container">
					{#each challenge_list as c}
						<div class="challenge_box">
							<div class="box_title">{c.name}</div>
							<div class="box_intro">{c.intro}</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="grass">
				<div class=content_title>나의 잔디</div>
				<div class=grass_box>
					<div>잔디들</div>
				</div>
			</div>
			<button on:click={()=>{push('/test')}}>테스트 이동</button>
		</div>
	</div>
</div>

<style>
	.home{
		width: 1400px;
		min-width: 100%;
		height: 700px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/*.gnb_profile{
		position: relative;
	}
	.profile_container{
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
	}*/
	.overview{
		width: 1200px;
		display: flex;
		flex-direction: row;
	}
	.profile{
		width: 400px;
	}
	.content{
		width: 800px;
		padding: 30px 10px 0px 10px;
	}
	.profile_img{
		border: #AAAAAA solid 2px;
		background-color: #FAE5E5;
		border-radius: 200px;
		height: 360px;
		width: 360px;
	}
	.profile_id{
		padding: 10px 0px 10px 0px;
		font-size: 1.2em;
		color: #666666;
	}
	.edit_btn{
		width: 360px;
		height: 30px;
		padding-top: 7.5px;
		text-align: center;
		background-color: #FBFBFB;
		border: #AAAAAA solid 2px;
		border-radius: 10px;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.9em;
		font-weight: bold;
	}
	.content_title{
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 1em;
		font-weight: bold;
		padding-bottom: 10px;
	}
	.box_container{
		display: grid;
		grid-template-columns: 380px 380px;
		column-gap: 20px;
		row-gap: 20px;
		margin-bottom: 30px;
	}
	.challenge_box{
		border: #AAAAAA solid 2px;
		height: 110px;
		border-radius: 10px;
		display: inline-block;
	}
	.box_title{
		padding: 15px 0 0 15px;
		color: #336CFF;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.9em;
		font-weight: bold;
	}
	.box_intro{
		padding: 5px 0 0 15px;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.85em;
	}
	.grass_box{
		border: #AAAAAA solid 2px;
		border-radius: 10px;
		height: 120px;
	}
</style>