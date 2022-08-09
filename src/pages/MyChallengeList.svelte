<script>
	import { onMount, onDestroy } from 'svelte';
	import { push } from 'svelte-spa-router'
	import { changeTab } from '../store/page';
	
	import { index } from '../const/tab';

	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import Profile from '../components/Profile.svelte';
	import ChallengeBox from '../components/ChallengeBox.svelte';
	import { Button, SearchInput } from '../storybook';

	import { myChallengeList, getUserChallenge, myChallengePage } from '../store/myChallenge.js'
	
	let filteredList = [];
	
	function onClick() {
		push('/createchallenge');
	}
	
	onMount(async () => {
		changeTab(index.MYCHALLENGE);
		await getUserChallenge();
		filteredList = $myChallengeList;
	})
	onDestroy(() => {
		changeTab(index.HOME);
	});

	async function searchHandler(val) {
		await getUserChallenge();
		filteredList = $myChallengeList.filter((challenge) => 
			challenge.name.includes(val)
		)
	}

	function changeHandler(val) {
		filteredList = $myChallengeList.filter((challenge) => 
			challenge.name.includes(val)
		)
	}
</script>

<GlobalNavigationBar />
<div class="MyChallengeList">
	<Profile />
	<div class="MyChallengeList__content">
		<div class="MyChallengeList__input-box">
			<SearchInput {searchHandler} {changeHandler} />
			<Button {onClick} width="4rem" height="1.9rem" backgroundColor="#50CE92" style="border: none; color: white;">New</Button>
		</div>
		<div class="MyChallengeList__list">
			{#each filteredList as challenge}
				<ChallengeBox challenge={challenge} />
			{/each}
		</div>
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
			margin-top: 1rem; // TotalChallengeList와 맞춰야한다.
		}

		&__list {
			margin-top: 2rem;
		}
	}
</style>
