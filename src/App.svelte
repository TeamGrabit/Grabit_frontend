<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
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
	<Footer />
</body>

<style>
	
</style>