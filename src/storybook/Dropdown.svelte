<script>
	import { onDestroy } from 'svelte';
	export let onClickOut;
	export let open;
	export let right;

	let rightCss;
	if(right) rightCss = 'Dropdown--right';

	function onClickOutside(e) {
		if(open){
			if(!e.target.closest('.Dropdown')) {
				if(!e.target.closest('.header__profile'))
					onClickOut();
			}
		}
	}
	document.addEventListener('click', onClickOutside);
	window.onhashchange = function() {
    	onClickOut();
	}
</script>

{#if open}
	<div class="Dropdown {rightCss}">
		<slot />
	</div>
{/if}

<style lang="scss">
	.Dropdown{
		position: absolute;
		background: var(--main-white-color);
		box-shadow: 2px 2px 5px rgba(0, 0, 0, .3);
		z-index: 10;

		&--right {
			right: 0;
		}
	}
</style>