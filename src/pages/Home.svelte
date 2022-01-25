<script>
	import {link, push} from 'svelte-spa-router'
	import Gnb from '../components/GNB.svelte';
	import Container from '../components/Container.svelte';
	import Profile from '../components/Profile.svelte';
	import Grass from '../components/Grass.svelte';

	let challenge_list = [
		{num: 1, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"},
		{num: 2, name: "My Private Challenge", intro: "이 챌린지는 내가 관리하는 챌린지다!!"},
		{num: 3, name: "No.3", intro: "누가 넘바 쓰리래, 나 넘바 투야!"},
	]
	
	let grass_list = new Array(365);
	
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 2;
	};

</script>

<div class="home">
	<Gnb />
	<Container>
		<div class="overview">
			<Profile />
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
					<Grass grass_list={grass_list} />
				</div>
			</div>
		</div>
	</Container>
</div>

<style>
	.home{
		z-index: 2;
		min-width: 100%;
		padding-bottom: 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.overview{
		padding-top: 4%;
		width: 100%;
		display: flex;
		flex-direction: row;
	}
	.content{
		width: 67%;
		margin-top: 2%;
		padding: 1.875rem 0.625rem 0 0.625rem;
	}
	.content_title{
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 1rem;
		font-weight: bold;
		padding-bottom: 0.625rem;
	}
	.box_container{
		display: grid;
		grid-template-columns: 48% 48%;
		column-gap: 4%;
		row-gap: 1.75rem;
		margin-bottom: 1.875rem;
	}
	.challenge_box{
		border: #AAAAAA solid 2px;
		height: 6.875rem;
		border-radius: 0.625rem;
		display: inline-block;
	}
	.box_title{
		padding: 0.9375rem 0 0 0.9375rem;
		color: #336CFF;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.9rem;
		font-weight: bold;
	}
	.box_intro{
		padding: 0.3125rem 0 0 0.9375rem;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.85rem;
	}
</style>