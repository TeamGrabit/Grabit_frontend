import Home from './Home.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import ChallengeDetail from './ChallengeDetail.svelte';
import MyChallengeList from './MyChallengeList.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/login' : Login,
	'/setting/:id' : Setting,
	'/challenge/:id' : ChallengeDetail,
	'/mychallenge' : MyChallengeList, // TODO: 사람 별로 페이지를 가질지 결정 후 변경
	'*': NotFound,
}