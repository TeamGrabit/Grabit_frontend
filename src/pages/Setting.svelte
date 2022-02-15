<script>
	import { SubNav, SubNavItem } from '../storybook';
	
	const tabItem = ['설정', '참여 승인']
	let activeItem = -1;
	function onClickItem(i) {
		activeItem = i;
	}
	function setActive(i) {
		if(i === activeItem) return true;
	}
</script>

<div class="Setting">
	<SubNav>
		{#each tabItem as item, index}
			<SubNavItem onClick={() => onClickItem(index)} isActive={activeItem === index}>{item}</SubNavItem>
		{/each}
	</SubNav>
	Setting page
</div>

<style lang="scss">
	.Setting {
		
	}
</style>