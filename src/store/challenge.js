import { writable, get } from 'svelte/store';

import { notifications } from './notifications.js';
import { fetchGet, fetchPatch } from '../common/fetch';

const initialState = [];

export let challengeList = writable(initialState);
export let totalPages=writable(0);

export async function getChallenge( id ) {
	const res = await fetchGet(`challenges/${id}`)
	return res;
}

export async function getAllChallenge(page, size) {
    const res = await fetchGet('challenges?page='+page+'&size='+size);
    if(res.error)
        failGetChallenge();
    else{
        challengeList.set(res.content);
        totalPages.set(res.totalPages); 

    }
}

function failGetChallenge(){
    notifications.send("불러오기 실패!  다시 시도해주세요!");
}

export async function joinChallenge( challenge_id ) {
	const res = await fetchPatch(`challenges/${challenge_id}/join`);
	return res;
}