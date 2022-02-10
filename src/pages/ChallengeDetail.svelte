<script>
	import { link, push } from 'svelte-spa-router'
	import Grass from '../components/Grass.svelte';
	import Button from '../storybook/Button.svelte';
	
	let challenge = {num: 1, name: "CS 1일 1커밋 방", intro: "하루에 한 번씩 커밋하기!"};

	let group = ["user", "grabit123", "||JTO||", "guest"];
	let grass_list = new Array(365);
	let grass_team = new Array(365);
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 2;
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
	<div class="title">{challenge.name}</div>
	<div class="description">{challenge.intro}</div>
</div>
<div class="content">
	<div class="team_grass">
		<div class="title team_title">Team 의 잔디</div>
		<Grass isBig grass_list={grass_team} />
	</div>
	<div class="personal_admit">
		<div class="personal">
			{#each group as member}
				<div class="personal_grass">
					<div class="title">
						<div class="member_name">{member}</div>&nbsp;의 잔디
					</div>
					<Grass grass_list={grass_list} />
				</div>
			{/each}
		</div>
		<div class="admit_req">
			<div class="title">현재 올라온 요청</div>
			<div class="admit_req_box">
				{#each req_list as req}
					<div class="req_box">
						<div class="req_box_desc">{req.desc}</div>
						<div class="req_box_requester">{req.requester}</div>
						<div class="req_box_btn">
							<div class="approver">{req.approve.length}&nbsp;/&nbsp;{group.length-1}</div>
							<div>
								<Button
									width='5rem'
									height='2rem'
									backgroundColor='#4285f4'
								>
									<div class="btn_txt">승 인</div>
								</Button>
								<Button
									width='5rem'
									height='2rem'
									backgroundColor='#ea4335'
								>
									<div class="btn_txt">반 려</div>
								</Button>
							</div>
						</div>
					</div>
				{/each}
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
			display: flex;
			padding-left: 0.25rem;
			margin-bottom: 0.4rem;
			.member_name{
				font-weight: 550;
			}
		}
		.team_grass{
			margin-bottom: 2rem;
			
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
					margin-bottom: 1.5rem;
				}
			}
			.admit_req{
				width: 30%;
				margin-left: 3%;
				&_box{
					height: 30rem;
					border: solid 2px #AAAAAA;
					border-radius: 0.625rem;
					overflow-y: overlay;
					&::-webkit-scrollbar {
						display: none;
					}
					.req_box{
						border: solid 2px #AAAAAA;
						border-radius: 0.625rem;
						margin: 0.5rem;
						
						&_desc{
							height: 3rem;
							margin: 0.5rem 0.5rem 0 0.5rem;
						}
						&_requester{
							display: flex;
							justify-content: flex-end;
							margin: 0.5rem;
							font-weight: 550;
						}
						&_btn{
							background-color: #EEEEEE;
							display: flex;
							justify-content: space-between;
							padding: 0.5rem 0.5rem 0.5rem 20%;
							border-bottom-left-radius: 0.625rem;
							border-bottom-right-radius: 0.625rem;
							.approver{
								font-size: 1.1rem;
								font-weight: 550;
								display: flex;
								flex-direction: row;
								align-items: center;
							}
							.btn_txt{
								color: white;
								font-weight: 550;
							}
						}
					}
				}
			}
		}
	}
</style>
