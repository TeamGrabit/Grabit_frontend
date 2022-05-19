<script>
	import { link, push } from 'svelte-spa-router';
	import { onMount, beforeUpdate, afterUpdate } from 'svelte';
	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import Profile from '../components/Profile.svelte';
	import Grass from '../components/Grass.svelte';
	import { user, getUser } from '../store/user.js';
	import { changeTab } from '../store/page';
	import { challengeList } from '../store/challenge.js';
	import { ACCESS_TOKEN } from '../common/Variable';
	import { getGrass } from '../store/grass';

	let grass_list = null

	// TODO: 유저별로 home을 만들지 자기 home만 보이게 할 것인지 회의 필요
	onMount(async() => {
		changeTab(0)
		if (!$user){
			if(localStorage.getItem(ACCESS_TOKEN)) await getUser();
			else push('/login');
		}
		grass_list = await getGrass($user?.githubId)
	})
</script>

<GlobalNavigationBar />
<div class="overview">
	<Profile />
	<div class="content">
		<div class="pinned">
			<div class="content_title">즐겨찾는 챌린지</div>
			<div class="box_container">
				{#each $challengeList as challenge}
					<div class="challenge_box">
						<div class="box_title" on:click={()=>{push(`/challenge/${challenge.id}`)}}>{challenge.title}</div>
						<div class="box_intro">{challenge.description}</div>
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
						cursor: pointer;
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
