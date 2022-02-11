<script>
	import Grass from '../components/Grass.svelte';
	import CommitRequest from '../components/CommitRequest.svelte';
	import { getChallenge } from '../store/challenge.js';

	//let challenge = {num: 132, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"};
	let challenge = getChallenge(132);
	console.log(challenge);

	let group = ["user", "grabit123", "||JTO||", "guest"];
	let grass_list = new Array(365);
	let grass_team = new Array(365);
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 9;
		grass_team[i] = i % 5;
	};

	let req_list = [
		{num: 1, requester: "user", desc: "feat: challengeDetail", approve: ["grabit_123", "||JTO||"]},
		{num: 2, requester: "grabit_123", desc: "fix: 버그 픽스", approve: []},
		{num: 3, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
		{num: 4, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
		{num: 5, requester: "||JTO||", desc: "feat: commit approve request", approve: ["grabit_123"]},
	];

</script>

<div class="upper">
	<div class="upper_title">{challenge.name}</div>
	<!--<div class="upper_description">{challenge.intro}</div>-->
	<div class="upper_description">하루 한번 씩</div>
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
		<Grass isBig grass_list={grass_team} group_num={group.length}/>
	</div>
	<div class="personal_admit">
		<div class="personal">
			{#each group as member}
				<div class="personal_grass">
					<div class="grass_title">
						<p style="font-weight: bold;">{member}</p>
						<p>의 잔디</p>
					</div>
					<Grass grass_list={grass_list} />
				</div>
			{/each}
		</div>
		<CommitRequest group={group} req_list={req_list}/>
	</div>
</div>

<style lang="scss">
	.upper{
		height: 3rem;
		padding: 1rem;
		background-color: #F7F7F7;
		width: 100%;
		border-bottom: solid 1px #DDDDDD;
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
