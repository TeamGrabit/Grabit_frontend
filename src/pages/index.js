import Home from './Home.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import ChallengeDetail from './ChallengeDetail.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/login' : Login,
	'/setting/:id' : Setting,
	'/challenge/:id' : ChallengeDetail,
	'*': NotFound,
}