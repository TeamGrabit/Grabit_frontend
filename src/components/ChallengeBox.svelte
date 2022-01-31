<script>
	export let title;
	export let description;
	export let count;
	export let leader;
	export let isLeader;
	export let isStarred;

	export let onClickTitle;
	export let onClickStar;
	export let onClickSetting;
</script>

<div class="Box">
	<div>
		<div class="Box__header">
			<span class="Box__header__title">{title}</span>
			<div class="Box__header__group">
				<span>
					{#if isStarred}
						<img class="Box__icon" src="images/star.svg" alt="star" />
					{:else}
						<img class="Box__icon" src="images/staroutline.svg" alt="star" />
					{/if}
				</span>
				<img class="Box__icon" src="images/setting.svg" alt="setting" />
			</div>
		</div>
		<div class="Box__content">
			{description || ''}
		</div>
	</div>
	<div class="Box__footer">
		<div class="Box__footer__group">
			<img class="Box__icon" src="images/human.svg" alt="human" />
			{count || 0}
		</div>
		<div class="Box__footer__group">
			<img class="Box__icon" src="images/crown.svg" alt="crown" />
			{leader || ''}
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
		border: 1px solid var(--border-color);
		border-radius: 10px;

		&__icon {
			height: 1.1rem;
		}

		&__header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 0.6rem;

			&__title {
				color: var(--challenge-box-header-color);
				font-weight: bold;

				&:hover {
					filter: brightness(0.55);
					cursor: pointer;
				}
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