<script>
	import { user } from '../store/user.js';
	import { GIT_URL } from '../common/Variable.js';
</script>

<div class="profile">
	{#if $user}
		<img src='{GIT_URL}/{$user.githubId}.png' alt='userProfile' class="profile_img" />
	{/if}
	<div class="profile_id">{$user?.githubId}</div>
	<div class="edit_btn">
		<p>Edit profile</p>
	</div>
</div>

<style lang="scss">
	.profile{
		position: relative;
		width: 33%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.profile_img{
			border: #AAAAAA solid 2px;
			border-radius: 50%;
			width: 22.5rem;
			height: 22.5rem;
			box-sizing: border-box;
		}
		.profile_id{
			width: 22.5rem;
			padding: 0.625rem 0 0.625rem 0;
			font-size: 1.2rem;
			color: #666666;
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
	}
</style>
