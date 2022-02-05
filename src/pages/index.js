import Home from './Home.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import ChallengeList from './ChallengeList.svelte';
import ChallengeDetail from './ChallengeDetail.svelte';
import CreateChallenge from './CreateChallenge.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/login' : Login,
	'/setting/:id' : Setting,
	'/createchall':CreateChallenge,
	'/challengelist': ChallengeList,
	'/challenge/:id' : ChallengeDetail,
	'*': NotFound,
}