<script>
	import { push } from 'svelte-spa-router';
	import { user } from '../store/user';

	export let challenge;

	const isLeader = $user === challenge.leader;
	let isStarred = challenge.isStarred;

	function onClickTitle(){
		push(`/challenge/${challenge.id}`)
	}
	function onClickStar(){
		// TODO: debounce같은 거 걸어서 api 요청하기
		isStarred=!isStarred;
	}
	function onClickSetting(){
		push(`/setting/${challenge.id}`);
	}
</script>

<div class="Box">
	<div>
		<div class="Box__header">
			<span class="Box__header__title" on:click={onClickTitle}>{challenge.name}</span>
			<div class="Box__header__group">
					{#if isLeader}
						<img class="Box__icon Box__icon--left" src="images/setting.svg" alt="setting" on:click={onClickSetting} />
					{/if}
					{#if isStarred}
						<img class="Box__icon Box__icon--yellow" src="images/star.svg" alt="star" on:click={onClickStar}/>
					{:else}
						<img class="Box__icon" src="images/star-line.svg" alt="star_outline" on:click={onClickStar}/>
					{/if}
			</div>
		</div>
		<div class="Box__content">
			{challenge.description || ''}
		</div>
	</div>
	<div class="Box__footer">
		<div class="Box__footer__group">
			<img class="Box__icon" src="images/human.svg" alt="human" />
			{challenge.count || 0}
		</div>
		<div class="Box__footer__group">
			<img class="Box__icon" src="images/crown.svg" alt="crown" />
			{challenge.leader || ''}
		</div>
	</div>
</div>

<style lang="scss">
	.Box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 5rem;
		padding: 1.5rem;
		margin: 1rem 0rem;
		border: 2px solid var(--border-color);
		border-radius: 20px;

		&__icon {
			height: 1.2rem;
			margin-right: 0.3rem;

			&--yellow {
				filter: invert(79%) sepia(99%) saturate(4174%) hue-rotate(334deg) brightness(98%) contrast(105%);
			}

			&--left {
				position: absolute;
				right: 2rem;
    			top: 0.5px;
			}

			&:hover {
				cursor: pointer;
			}
		}

		&__header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 0.6rem;

			&__title {
				color: var(--dark-green-color);
				font-weight: bold;

				&:hover {
					filter: brightness(0.55);
					cursor: pointer;
				}
			}

			&__group {
				position: relative;

			}
		}

		&__footer {
			display: flex;
			gap: 1rem;

			&__group {
				display: flex;
				align-items: center;
			}
			
		}
	}
</style>
