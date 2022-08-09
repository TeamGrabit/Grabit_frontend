<script>
	import { user } from '../store/user.js';
	import { GIT_URL } from '../common/Variable.js';
	import { push } from 'svelte-spa-router'

	function onClickEditProfile(){
		push('/edit_profile');
	}
	function onClickLogin(){
		push('/login')
	}

	console.log($user);
</script>

<div class="profile">
	{#if $user}
		<img src={$user.profileImg||GIT_URL+'/'+$user.githubId+'.png'} alt='userProfile' class="profile__img" />
		<div class="profile__id">{$user.usernam ?? $user.githubId}</div>
		<button class="edit_btn" on:click={onClickEditProfile}>
			<p>Edit profile</p>
		</button>
	{:else}
		<img class="profile__img" src="images/grabit_logo.png" alt='default_image_grabit_logo'>
		<div class="profile__id">Guest</div>
		<button class="edit_btn" on:click={onClickLogin}>
			<p>Sign in</p>
		</button>
	{/if}
</div>

<style lang="scss">
	.profile{
		position: relative;
		width: 33%;
		display: flex;
		flex-direction: column;
		align-items: center;

		&__img{
			border: #AAAAAA solid 2px;
			background-color: #FFFFFF;
			border-radius: 50%;
			width: 22.5rem;
			height: 22.5rem;
			box-sizing: border-box;
		}

		&__id{
			width: 22.5rem;
			padding: 0.625rem 0 0.625rem 0;
			font-size: 1.2rem;
			color: #666666;
		}
	}

	.edit_btn{
		width: 22.5rem;
		height: 1.875rem;
		background-color: #FBFBFB;
		border: #AAAAAA solid 2px;
		border-radius: 0.625rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 0.9rem;
		font-weight: bold;
	}
	
</style>
