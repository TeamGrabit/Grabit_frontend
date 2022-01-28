import Home from './Home.svelte';
import Test from './Test.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import CreateChallenge from './CreateChallenge.svelte';
import ChallengeDetail from './ChallengeDetail.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/test' : Test,
	'/login' : Login,
	'/create':CreateChallenge,
	'/setting/:id' : Setting,
	'/challenge/:id' : ChallengeDetail,
	'*': NotFound,
}