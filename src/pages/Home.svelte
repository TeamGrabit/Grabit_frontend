<script>
	import { link, push } from 'svelte-spa-router';
	import { onMount, beforeUpdate } from 'svelte';
	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import Profile from '../components/Profile.svelte';
	import Grass from '../components/Grass.svelte';
	import { user } from '../store/user.js';
	import { changeTab } from '../store/page';

	let challenge_list = [
		{num: 1, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"},
		{num: 2, name: "My Private Challenge", intro: "이 챌린지는 내가 관리하는 챌린지다!!"},
		{num: 3, name: "No.3", intro: "누가 넘바 쓰리래, 나 넘바 투야!"},
	]
	
	let grass_list = new Array(365);
	
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 2;
	};

	// TODO: 유저별로 home을 만들지 자기 home만 보이게 할 것인지 회의 필요
	beforeUpdate(() => {
		if (!$user){
			push('/login');
		}
	});

	onMount(() => {
		changeTab(0)
	})
</script>

<GlobalNavigationBar />
<div class="overview">
	<Profile />
	<div class="content">
		<div class="pinned">
			<div class="content_title">즐겨찾는 챌린지</div>
			<div class="box_container">
				{#each challenge_list as c}
					<div class="challenge_box">
						<div class="box_title" on:click={()=>{push(`/challenge/${c.num}`)}}>{c.name}</div>
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

<style lang="scss">
	.overview{
		padding-top: 4%;
		padding-bottom: 4%;
		width: 100%;
		display: flex;
		flex-direction: row;

		.content{
			width: 67%;
			margin-top: 2%;
			padding: 1.875rem 0.625rem 0 0.625rem;

			&_title{
				font-size: 1rem;
				font-weight: bold;
				margin-bottom: 0.625rem;
			}
			.box_container{
				display: grid;
				grid-template-columns: 48% 48%;
				column-gap: 4%;
				row-gap: 1.75rem;
				margin-bottom: 1.875rem;

				.challenge_box{
					border: #AAAAAA solid 2px;
					height: 6.875rem;
					border-radius: 0.625rem;
					display: inline-block;
					
					.box_title{
						padding: 0.9375rem 0 0 0.9375rem;
						color: #336CFF;
						font-size: 0.9rem;
						font-weight: bold;
					}
					.box_intro{
						padding: 0.3125rem 0 0 0.9375rem;
						font-size: 0.85rem;
					}
				}
			}
		}
	}
</style>
