<script>
	import { user } from '../store/user.js';
</script>

<div class="profile">
	<div class="profile_img" />
	<div class="profile_id">{$user}</div>
	<div class="edit_btn">Edit profile</div>
</div>

<style>
	.profile{
		position: relative;
		/*width: 25rem;*/
		width: 33%;
	}
	.profile_img{
		border: #AAAAAA solid 2px;
		background-color: #FAE5E5;
		border-radius: 50%;
		width: 90%;
		padding-bottom: 90%;
	}
	.profile_id{
		padding: 0.625rem 0 0.625rem 0;
		font-size: 1.2rem;
		color: #666666;
	}
	.edit_btn{
		width: 90%;
		height: 1.875rem;
		padding-top: 0.46875rem;
		text-align: center;
		background-color: #FBFBFB;
		border: #AAAAAA solid 2px;
		border-radius: 0.625rem;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 0.9rem;
		font-weight: bold;
	}
</style>