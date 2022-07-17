import { writable, get } from 'svelte/store';
import { notifications } from './notifications.js';
import { fetchGet, fetchPatch } from '../common/fetch';

const initialState = [];

export let challengeList = writable(initialState);
export let totalPages=writable(0);

export async function getChallenge( id ) {
	let res = await fetchGet(`challenges/${id}`)
	if(res.error) {
		// TODO: api 연결된 후에는 에러처리 하기
		res = {name: 'API 연결해죠', description: 'API 연결행', isPrivate: true };
	}
	return res;
}

export async function getAllChallenge(page, size) {

	const res = await fetchGet('challenges?'+ new URLSearchParams({
		page: page,
		size: size,
	}));

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

export async function getUserChallenge() {
	const res = await fetchGet(`users/challenges`);
	return res;
}

export async function joinChallenge( challenge_id ) {
	const res = await fetchPatch(`challenges/${challenge_id}/join`);
	return res;
}

export function getApproveList(groupId) {
	// TODO: api 나오면 연결하기
	return [
		{
			requestId: 1,
			name: 'tnghd5761',
			message: '같이 해요 :)같이 해요 :)같이 해요 :)같이 해요 :)'
		},
		{
			requestId: 2,
			name: 'llJTOll',
			message: '같이 해요 :)'
		},
		{
			requestId: 2,
			name: 'MOBUMIN',
			message: '같이 해요 :)'
		}
	]
}

export const editChallenge = async(id, body) => {
	const res = await fetchPatch(`challenges/${id}`, body);
	return res;
}

export const deleteChallenge = async(id) => {
	const res = await fetchDelete(`challenges/${id}`);
	return res;
}
