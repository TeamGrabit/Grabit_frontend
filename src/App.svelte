<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Router  from 'svelte-spa-router';
	import Home from './pages/Home.svelte';
	import Test from './pages/Test.svelte';
	import Login from './pages/Login.svelte';
	import Profile from './pages/Profile.svelte';
	import CreateChallenge from './pages/CreateChallenge.svelte';

	const routes = {
		'/': Home,
		'/test' : Test,
		'/login' : Login,
		'/profile' : Profile,
		'/createchall' : CreateChallenge,
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
		min-height: calc(100% - 7.6rem);
		background-color: var(--main-background-color);
	}
</style>