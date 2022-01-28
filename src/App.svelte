<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Container from './components/Container.svelte';
	import Router  from 'svelte-spa-router';
	import Home from './pages/Home.svelte';
	import Test from './pages/Test.svelte';
	import Login from './pages/Login.svelte';
	import ChallengeDetail from './pages/ChallengeDetail.svelte';

	const routes = {
		'/': Home,
		'/test' : Test,
		'/login' : Login,
		'/challenge/:id' : ChallengeDetail,
	}
</script>

<main style="height:100%">
	<Header />
	<div class="body">
		<Container>
			<Router {routes} />
		</Container>
	</div>
	<Footer />
</main>

<style>
	.body {
		min-height: calc(100% - 7.6rem);
		background-color: var(--main-background-color);
	}
</style>