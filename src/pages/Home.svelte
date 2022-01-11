<script>
	import {link, push} from 'svelte-spa-router'
</script>

<div>home</div>
<button on:click={()=>{push('/test')}}>이동</button>