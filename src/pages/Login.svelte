<script>
	import { login } from '../store/user';
	import Button from '../storybook/Button.svelte';
	
	function onClick() {
		login();
	}
</script>

<div class="Login">
	<img class="Login__logo" src="images/grabit_logo.png" alt="logo" />
	<Button
		width='15rem'
		height='2.5rem'
		backgroundColor='var(--main-white-color)'
		{onClick}
	>
		<span class="Login__slot">
			<img class="Login__icon" src="images/github.png" alt="gitIcon" />
			<span>깃허브 로그인</span>
		</span>
	</Button>
</div>

<style lang="scss">
	.Login {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 3rem;

		&__logo {
			height: 9.375rem;
		}

		&__slot {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.3rem;
		}

		&__icon {
			width: 1.5rem;
		}
	}
</style>