<script>
	import { onMount } from 'svelte';
	import { Card, Loader, Button } from '../storybook';
	import { getApproveList } from '../store/challenge.js'
	import { GIT_URL } from '../common/Variable.js';
	export let params;
	export let isActive;
	let CardList;

	onMount(() => {
		// TODO: API 연결
		CardList = getApproveList();
	})
	
</script>

{#if isActive}
	{#if !CardList}
		<Loader />
	{:else}
		<div class="Card">
			<div class="Card__list">
				{#each CardList as card}
					<Card>
						<div class="Card__body">
							<img src='{GIT_URL}/{card.name}.png' alt='userProfile' class="Card__profile" />
							<div class="Card__body__content">
								<h3 class="Card__body__head Card__body--ellipsis">
									{card.name}
								</h3>
								<p class="Card__body--ellipsis">
									{card.message}
								</p>
							</div>
							<div>
								<Button
									width='2rem'
									height='2rem'
									backgroundColor='var(--main-green-color)'
									style='padding: 0;'
								>
									<img src="images/check.svg" class="Card__button__image" alt="Check">
								</Button>
								<Button
									width='2rem'
									height='2rem'
									backgroundColor='#FAE5E5'
									style='padding: 0;'
								>
									<img src="images/x.svg" class="Card__button__image" alt="Reject">
								</Button>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	.Card{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		padding-top: 7rem;

		&__list {
			display: flex;
			gap: 2rem;
			flex-wrap: wrap;
		}

		&__body {
			display: flex;
			gap: 1rem;
			align-items: center;
			width: 18rem;

			&__content {
				white-space: nowrap;
				width: 50%;
			}

			&__head {
				height: 1.2rem;
				margin-bottom: 0.6rem;
				font-weight: bold;
				color: var(--dark-green-color);
			}

			&--ellipsis {
				overflow: hidden;
    			text-overflow: ellipsis;
			}
		}

		&__profile {
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 50%;
			outline: #AAAAAA solid 2px;
		}

		&__button {
			&__image {
				width: 80%;
				height: 100%;
			}
		}
	}
</style>
