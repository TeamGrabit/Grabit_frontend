<script>
	import Header from './components/Header.svelte';
	import Router from 'svelte-spa-router';
	import Home from './pages/Home.svelte';
	import Test from './pages/Test.svelte';

	const routes = {
		'/': Home,
		'/test' : Test,
	}
</script>

<body>
	<Header />
	<Router {routes} />
</body>

<style>
	body {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>