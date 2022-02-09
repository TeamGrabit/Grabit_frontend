<script>
	import { link, push } from 'svelte-spa-router'
	import Grass from '../components/Grass.svelte';
	
	let challenge = {num: 1, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"};

	let group = [0, 1, 2, 3];
	let grass_list = new Array(365);
	let grass_team = new Array(365);
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 2;
		grass_team[i] = i % 5;
	};

</script>

<div class="upper">
	<div class="title">{challenge.name}</div>
	<div class="description">{challenge.intro}</div>
</div>
<div class="content">
	<div class="team_grass">
		<div class="title team_title">Team의 잔디</div>
		<Grass isBig grass_list={grass_team} />
	</div>
	<div class="personal_admit">
		<div class="personal">
			{#each group as member}
				<div class="personal_grass">
					<div class="title">{member}의 잔디</div>
					<Grass grass_list={grass_list} />
				</div>
			{/each}
		</div>
		<div class="admit_req">
			<div class="req_box">
				<div>내용</div>
				<div>승인</div>
				<div>반려</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.upper{
		height: 3rem;
		padding: 1rem;
		background-color: #F7F7F7;
		width: 100%;
		border-bottom: solid 1px #DDDDDD;
		.title{
			padding-bottom: 1rem;
			font-weight: bold;
			color: #336CFF;
		}
		.description{
			font-size: 0.9rem;
		}
	}
	.content{
		width: 100%;
		margin: 2rem 0 2rem 0;
		
		.title{
			padding-bottom: 0.25rem;
		}
		.team_grass{
			padding-bottom: 2rem;
			
			.team_title{
				font-weight: bold;
				font-size: 1.1rem;
			}
		}
		.personal_admit{
			display: flex;
			flex-direction: row;
			width: 100%;

			.personal{
				width: 67%;

				.personal_grass{
				padding-bottom: 1.5rem;
			}
			}
			.admit_req{
				width: 33%;
				border: solid 2px #DDDDDD;
				border-radius: 3%;
				margin: 1rem;
			}
		}
	}
</style>