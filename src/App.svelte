<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Container from './components/Container.svelte';
	import Router  from 'svelte-spa-router';
	import routes from './pages';
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