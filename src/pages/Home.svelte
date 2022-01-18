<script>
	import {link, push} from 'svelte-spa-router'
</script>

<div class="home">
	home
	<button on:click={()=>{push('/test')}}>이동</button>
</div>

<style>
	.home{
		height: 400px;
	}
</style>