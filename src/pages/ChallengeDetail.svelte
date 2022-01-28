<script>
	import {link, push} from 'svelte-spa-router'
	import Gnb from '../components/GlobalNavigationBar.svelte';
	import Container from '../components/Container.svelte';
	import Grass from '../components/Grass.svelte';
	
	let grass_list = new Array(365);
	
	for (let i=0; i<365; i+=1){
		grass_list[i] = i % 2;
	};

</script>

<div>상세 페이지</div>

<style>

</style>