<script>
	import { push } from 'svelte-spa-router'

	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import Profile from '../components/Profile.svelte';
	import ChallengeBox from '../components/ChallengeBox.svelte';
	import { Button } from '../storybook';
	
	function onClick() {
		alert('new Challenge!');
	}
</script>

<GlobalNavigationBar />
<div class="MyChallengeList">
	<Profile />
	<div class="MyChallengeList__content">
		<ChallengeBox title="CS 1일 1커밋의 방" description="hi" />
	</div>
</div>

<style lang="scss">
	.MyChallengeList {
		padding-top: 4%;
		padding-bottom: 4%;
		width: 100%;
		display: flex;
		flex-direction: row;

		&__content{
			width: 67%;
			margin-top: 2%;
			padding: 1.875rem 0.625rem 0 0.625rem;
		}
	}
</style>