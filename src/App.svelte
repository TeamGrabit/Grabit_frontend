<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Router  from 'svelte-spa-router';
	import Home from './pages/Home.svelte';
	import Test from './pages/Test.svelte';
	import Login from './pages/Login.svelte';

	const routes = {
		'/': Home,
		'/test' : Test,
		'/login' : Login,
	}
</script>

<main style="height:100%">
	<Header />
	<div class="body">
		<Router {routes} />
	</div>
	<Footer />
</main>

<style>
	.body {
		padding: 0 10rem;
		min-height: calc(100% - 7.6rem);
		background-color: var(--main-background-color);
	}
</style>