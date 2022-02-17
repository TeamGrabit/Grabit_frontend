<script>
	import { push } from 'svelte-spa-router';
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { tabIndex, changeTab } from '../store/page';
	import { index } from '../const/tab';

	let classNames = ['', ''];
	
	function onClickMy() {
		push('/mychallenge')
	}
	function onClickTotal(){
		push('/totalchallenge')
	}

	beforeUpdate(() => {
		classNames = ['', ''];
		if($tabIndex !== 0)
			classNames[$tabIndex-1] = 'active';
	})
</script>

<div class="gnb">
	<div class="gnb_menu {classNames[0]}" on:click={onClickMy}>
		My Challenges
		<div class="bar" />
	</div>
	<div class="gnb_menu {classNames[1]}" on:click={onClickTotal}>
		View Other Challenges
		<div class="bar" />
	</div>
</div>
<style lang="scss">
	.gnb{
		position: absolute;
		height: 5rem;
		width: 75rem;
		min-width: 100%;
		border-bottom: #DDDDDD solid 1px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.2rem;
	}
	.gnb_menu{
		font-size: 1rem;
		font-weight: 500;
		height: 100%;
		display: flex;
		position: relative;
		align-items: center;
	}
	.gnb_menu:hover {
		cursor:pointer;
		color: var(--dark-green-color);
	}

	.bar {
		display: none;
		position: absolute;
		bottom: 0;
		height: 0.4rem;
		width: calc(100% + 1rem);
		left: -0.5rem;
		background: var(--dark-green-color);
	}

	.active {
		color: var(--dark-green-color);
		font-weight: bold;
	}
	.active > .bar {
		display: inline-block;
	}
</style>
