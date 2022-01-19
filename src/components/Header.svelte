<script>
	import {link, push} from 'svelte-spa-router'
	let name = "Grabit";
	let profile = "K"
</script>

<div class="header">
	<div class="header_inner">
		<div class="header_logo" on:click={()=>{push('/')}}>
			<img class="logo_img" src="images/grabit_logo.png" alt="logo" />
			<div class="header_title">
				{name}
			</div>
		</div>
		<div class="header_profile">
			<div class="profile_text">{profile}</div>
		</div>
	</div>
</div>
<style>
	.header{
		height: 60px;
		width: 1400px;
		min-width: 100%;
		border-bottom: #96E6B3 solid 2px;
	}
	.header_inner{
		padding-top: 10px;
		padding-left: 20px;
		padding-right: 20px;
		height: 40px;
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
		height: 40px;
	}
	.header_title {
		color: #568259;
		font-family: 'Noto Sans KR', 'Roboto';
		font-size: 1.4em;
		font-weight: bold;
	}
	.header_profile{
		height: 30px;
		width: 30px;
		display: flex;
		align-items: center;
		border: 1px solid black;
		border-radius: 15px;
	}
	.profile_text{
		padding: 10px;
	}
</style>