<script>
	import Button from '../components/Button.svelte';
</script>

<div class="Login">
	<img class="Login__logo" src="images/grabit_logo.png" alt="logo" />
	<Button width='15rem' height='2.5rem' backgroundColor='var(--main-green-color)'>
		깃허브 로그인
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
	}
</style>