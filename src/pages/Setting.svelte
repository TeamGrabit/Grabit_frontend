<script>
	import { onMount } from 'svelte';
	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import { SubNav, SubNavItem } from '../storybook';
	import SettingChallenge from '../components/SettingChallenge.svelte';
	import ApproveMember from '../components/ApproveMember.svelte';
	export let params = {}
	
	const tabItem = ['설정', '참여 승인']
	const settingSubComponent = [SettingChallenge, ApproveMember]
	let activeItem = 0;
	function onClickItem(i) {
		activeItem = i;
	}
	function setActive(i) {
		if(i === activeItem) return true;
		return false; 
	}
</script>

<GlobalNavigationBar />
<div class="Setting">
	<SubNav>
		{#each tabItem as item, index}
			<SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>{item}</SubNavItem>
		{/each}
	</SubNav>
	{#each settingSubComponent as SubComp, index}
		<SubComp isActive={activeItem === index} {params} />
	{/each}
</div>

<style lang="scss">
	.Setting {
		display: flex;
		gap: 2rem;
		width: 100%;
	}
</style>
