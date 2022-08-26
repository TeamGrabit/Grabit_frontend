<script>
	import { onMount, beforeUpdate } from 'svelte';
	import Grass from '../components/Grass.svelte';
	import CommitRequest from '../components/CommitRequest.svelte';
	import { getChallenge, joinChallenge } from '../store/challenge.js';
	import { ACCESS_TOKEN } from '../common/Variable';
	import { user, getUser } from '../store/user.js';
	import { getGrass } from '../store/grass';
	import { Button, Loader } from '../storybook';

	export let params = {}

	let isPrivate = true;
	let challenge = null;
	let grass_list = {};
	let grass_amount = 365 + new Date().getDay();
	let grass_team = new Array(grass_amount);
	for (let i=0; i<grass_amount; i+=1){
		grass_team[i] = {date:'', count: 0};
	};

	beforeUpdate(() => {
		if (!$user){
			if(localStorage.getItem(ACCESS_TOKEN)) getUser();
			else push('/login');
		}
	});
	onMount(async () => {
		challenge = await getChallenge(params.id);

		if (challenge.status != 401) {
			isPrivate = false;
		} else {
			return;
		}
		challenge.member.map(member_id => {
			const member_grass = getGrass(member_id);
			member_grass.then(value => {
				grass_list[member_id] =  value;
				for (let i=0; i<grass_amount; i++){
					if (grass_list[member_id][i].count > 0)
						grass_team[i].count += 1;
				};
			})
		})
	});

	let req_list = [
		{num: 1, requester: "user", desc: "feat: challengeDetail", approve: ["grabit_123", "||JTO||"]},
		{num: 2, requester: "grabit_123", desc: "fix: 버그 픽스", approve: []},
		{num: 3, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
		{num: 4, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
		{num: 5, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
	];

	function joinButtonClick(){
		const result = joinChallenge(params.id);
		alert("챌린지 가입 성공!");
	}
</script>


{#if isPrivate}
	<div class="upper">
		<div class="title_desc">
			<div class="upper_title">private challenge</div>
			<div class="upper_description">-</div>
		</div>
			<div class="join">
				<Button
					width='5rem'
					height='2rem'
					backgroundColor='#B8FFC8'
					onClick={joinButtonClick}
				>
					<div class="btn_txt">JOIN</div>
				</Button>
			</div>
	</div>
	<img class="challenge_default_image" src="images/challenge_detail_default.png" alt="blur_image" />
{:else}
	<div class="upper">
		<div class="title_desc">
			<div class="upper_title">{challenge.name}</div>
			<div class="upper_description">{challenge.description}</div>
		</div>
		{#if !challenge.member.includes($user.githubId)}
			<div class="join">
				<Button
					width='5rem'
					height='2rem'
					backgroundColor='#B8FFC8'
					onClick={joinButtonClick}
				>
					<div class="btn_txt">JOIN</div>
				</Button>
			</div>
		{/if}
	</div>
	<div class="content">
		<div class="team_grass">
			<p
				class="grass_title"
				style="
					font-weight: bold;
					font-size: 1.1rem;
				"
			>Team의 잔디</p>
			<Grass grass_list={grass_team} isBig group_num={challenge.member.length}/>
		</div>
		<div class="personal_admit">
			<div class="personal">
				{#each challenge.member as member}
					<div class="personal_grass">
						<div class="grass_title">
							<p style="font-weight: bold">{member}</p>
							<p>의 잔디</p>
						</div>
						{#if Array.isArray(grass_list[member])}
							<Grass grass_list={grass_list[member]} />
						{:else}
							<p>불러오는 중입니다.</p>
						{/if}
					</div>
				{/each}
			</div>
			<CommitRequest group={challenge.member} req_list={req_list}/>
		</div>
	</div>
{/if}


<style lang="scss">
	.challenge_default_image{
		width: 100%;
		filter: blur(10px);
	}
	.upper{
		height: 3rem;
		padding: 1rem;
		background-color: #F7F7F7;
		width: 100%;
		border-bottom: solid 1px #DDDDDD;
		display: flex;
		justify-content: space-between;
		&_title{
			padding-bottom: 1rem;
			font-weight: bold;
			color: #336CFF;
		}
		&_description{
			font-size: 0.9rem;
		}
	}
	.content{
		width: 100%;
		margin: 2rem 0 2rem 0;
		
		.grass_title{
			display: flex;
			padding-left: 0.25rem;
			margin-bottom: 0.4rem;
		}
		.team_grass{
			margin-bottom: 2rem;
		}
		.personal_admit{
			display: flex;
			flex-direction: row;
			width: 100%;

			.personal{
				width: 67%;

				.personal_grass{
					margin-bottom: 1.5rem;
				}
			}
		}
	}
</style>
