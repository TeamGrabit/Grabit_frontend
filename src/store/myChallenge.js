import { writable, get } from 'svelte/store';
import { fetchGet, fetchPatch } from '../common/fetch';

const initialState = [];

export let myChallengeList = writable(initialState);
export let myChallengePage = writable(1);

export async function getUserChallenge() {
	const res = await fetchGet(`users/challenges`);
	myChallengeList.set(res.content);
	myChallengePage.set(res.totalPages);
	return res.content;
}
