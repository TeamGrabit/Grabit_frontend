import { writable, get } from 'svelte/store';
import { notifications } from './notifications.js';
import { fetchGet, fetchPatch, fetchDelete, fetchPost } from '../common/fetch';

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

export async function joinChallenge( challenge_id ) {
	const res = await fetchPatch(`challenges/${challenge_id}/join`);
	return res;
}

export const getApproveList = async(params) => {
	const res = await fetchGet('challenges/join?' + new URLSearchParams({
		...params
	}))
	return res;
}

export const approveJoin = async(params) => {
	const res = await fetchPost('challenges/join/approve?' + new URLSearchParams({
		...params
	}))
	return res;
}

export const rejectJoin = async(params) => {
	const res = await fetchPost('challenges/join/reject?' + new URLSearchParams({
		...params
	}))
	return res;
}

export const editChallenge = async(id, body) => {
	const res = await fetchPatch(`challenges/${id}`, body);
	return res;
}

export const deleteChallenge = async(id) => {
	const res = await fetchDelete(`challenges/${id}`);
	return res;
}
