<script>
	import { push } from 'svelte-spa-router';
	import Button from '../components/Button.svelte';

	function onClick() {
		push('/');
	}
</script>

<div class="NotFound">
	<span class="NotFound__head">404</span>
	<span class="NotFound__sub">
		찾을 수 없는 페이지입니다.<br />
		요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.
	</span>
	<Button {onClick}>홈으로 가기</Button>
</div>

<style lang="scss">
	.NotFound {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__head {
			font-size: 10rem;
		}

		&__sub {
			text-align: center;
			padding-bottom: 1.5rem;
		}
	}
</style>