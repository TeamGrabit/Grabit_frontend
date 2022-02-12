<script>
	import Button from '../storybook/Button.svelte';
	export let group
	export let req_list;
</script>

<div class="admit_req">
	<p class="title">현재 올라온 요청</p>
	<div class="admit_req_box">
		{#each req_list as req}
			<div class="req_box">
				<div class="req_box_desc">{req.desc}</div>
				<div class="req_box_requester">{req.requester}</div>
				<div class="req_box_btn">
					<div class="approver">{req.approve.length}{" / "}{group.length-1}</div>
					<div>
						<Button
							width='5rem'
							height='2rem'
							backgroundColor='#B8FFC8'
						>
							<div class="btn_txt">승인</div>
						</Button>
						<span style="display:inline-block; width: 0.05rem;" />
						<Button
							width='5rem'
							height='2rem'
							backgroundColor='#FFB8B4'
						>
							<div class="btn_txt">반려</div>
						</Button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.admit_req{
		width: 30%;
		margin-left: 3%;
		
		.title{
			padding-left: 0.25rem;
			margin-bottom: 0.4rem;
		}
		&_box{
			height: 30rem;
			border: solid 1.5px #BCBCBC;
			border-radius: 0.625rem;
			overflow-y: overlay;
			&::-webkit-scrollbar{
				width: 1rem;
			}
			&::-webkit-scrollbar-thumb{
				border: 0.2rem solid transparent;
			}
			
			.req_box{
				border: solid 1.5px #BCBCBC;
				border-radius: 0.625rem;
				margin: 1rem;
				background: linear-gradient(#FFFFFF 64%, #EEEEEE 36%);
				
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
					display: flex;
					justify-content: space-between;
					padding: 0.5rem 0.5rem 0.5rem 17.5%;
					.approver{
						font-size: 1.1rem;
						font-weight: 550;
						display: flex;
						flex-direction: row;
						align-items: center;
					}
					.btn_txt{
						//color: white;
						font-weight: 550;
						letter-spacing: 0.3rem;
						text-indent: 0.3rem;
					}
				}
			}
		}
	}
</style>
