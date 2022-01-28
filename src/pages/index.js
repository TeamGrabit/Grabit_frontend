import Home from './Home.svelte';
import Test from './Test.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/test' : Test,
	'/login' : Login,
	'/:id/setting' : Setting,
	'*': NotFound,
}