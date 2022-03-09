<script>
	import GlobalNavigationBar from '../components/GlobalNavigationBar.svelte';
	import { SubNav, SubNavItem } from '../storybook';
	import SettingChallenge from '../components/SettingChallenge.svelte';
	import ApproveMember from '../components/ApproveMember.svelte';
	
	const tabItem = ['설정', '참여 승인']
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
	<SettingChallenge isActive={activeItem === 0} />
	<ApproveMember isActive={activeItem === 1} />
</div>

<style lang="scss">
	.Setting {
		
	}
</style>