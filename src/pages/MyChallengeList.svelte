<script>
	import { onMount, onDestroy } from 'svelte';
	import { push } from 'svelte-spa-router'
	import { changeTab } from '../store/page';
  	import { challengeList } from '../store/challenge.js';
	
	import { index } from '../const/tab';

	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import Profile from '../components/Profile.svelte';
	import ChallengeBox from '../components/ChallengeBox.svelte';
	import { Button, Input } from '../storybook';
	
	function onClick() {
		push('/createchallenge');
	}
	
	onMount(() => {
		changeTab(index.MYCHALLENGE);
	})
	onDestroy(() => {
		changeTab(index.HOME);
	});
</script>

<GlobalNavigationBar />
<div class="MyChallengeList">
	<Profile />
	<div class="MyChallengeList__content">
		<div class="MyChallengeList__input-box">
			<Input />
			<Button {onClick} width="4rem" height="1.9rem" backgroundColor="#50CE92" style="border: none; color: white;">New</Button>
		</div>
	    {#each $challengeList as c}
        	<ChallengeBox challenge={c} />
    	{/each}
	</div>
</div>

<style lang="scss">
	.MyChallengeList {
		padding-top: 4%;
		padding-bottom: 4%;
		width: 100%;
		display: flex;
		flex-direction: row;

		&__content {
			width: 67%;
			margin-top: 2%;
			padding: 1.875rem 0.625rem 0 0.625rem;
		}

		&__input-box {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
