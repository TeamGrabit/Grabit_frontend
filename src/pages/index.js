import Home from './Home.svelte';
import Login from './Login.svelte';
import Setting from './Setting.svelte';
import ChallengeDetail from './ChallengeDetail.svelte';
import CreateChallenge from './CreateChallenge.svelte';
import MyChallengeList from './MyChallengeList.svelte';
import TotalChallengeList from './TotalChallengeList.svelte';
import EditProfile from './EditProfile.svelte';
import RedirectPage from './RedirectPage.svelte';
import NotFound from './NotFound.svelte';

export default {
	'/': Home,
	'/login' : Login,
	'/setting/:id' : Setting,
	'/challenge/:id' : ChallengeDetail,
	'/createchallenge': CreateChallenge,
	'/mychallenge' : MyChallengeList, // TODO: 사람 별로 페이지를 가질지 결정 후 변경
	'/totalchallenge' : TotalChallengeList,
	'/edit_profile' : EditProfile,
	'/redirect': RedirectPage,
	'*': NotFound,
}
