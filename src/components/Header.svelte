<script>
	import { link, push } from 'svelte-spa-router'
	import { user } from '../store/user.js';
	import { GIT_URL } from '../common/Variable.js';

	const name = "Grabit";
	const src = `${GIT_URL}/${$user}.png`;
</script>

<div class="header">
	<div class="header_inner">
		<div class="header_logo" on:click={()=>{push('/')}}>
			<img class="logo_img" src="images/grabit_logo.png" alt="logo" />
			<div class="header_title">
				{name}
			</div>
		</div>
		<img {src} alt='user_profile' class="header_profile" />
	</div>
</div>
<style>
	.header{
		height: 3.75rem;
		/*width: 87.5rem;*/
		min-width: 100%;
		border-bottom: #96E6B3 solid 2px;
	}
	.header_inner{
		padding-top: 0.625rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		height: 2.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.header_logo{
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}
	.logo_img{
		height: 2.5rem;
	}
	.header_title {
		color: #568259;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 1.4rem;
		font-weight: bold;
	}
	.header_profile{
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
	}
</style>