import { writable, get } from 'svelte/store';
import { fetchDelete, fetchGet, fetchPatch } from '../common/fetch';

const initialState = [
    {
		id: 1,
        title: '챌린지1 입니다.',
        description: '내 챌린지입니다',
        leader: 'llJTOll',
        count: 3
    },
    {
		id: 2,
        title: '이 챌린지는 소개글이 없습니다',
        description: '',
        leader: 'MOBUMIN',
        count: 2,
		isStarred: true
    },
    {
		id: 3,
        title: '챌린지3',
        description: '남의 챌린지입니다',
        leader: 'user2',
        count: 1
    },
	{
		id: 4,
        title: '챌린지1 입니다.',
        description: '내 챌린지입니다',
        leader: 'llJTOll',
        count: 3
    },
    {
		id: 5,
        title: '이 챌린지는 소개글이 없습니다',
        description: '',
        leader: 'user1',
        count: 2,
		isStarred: true
    },
    {
		id: 6,
        title: '챌린지3',
        description: '남의 챌린지입니다',
        leader: 'user2',
        count: 1
    },
	{
		id: 7,
        title: '챌린지1 입니다.',
        description: '내 챌린지입니다',
        leader: 'llJTOll',
        count: 3
    },
    {
		id: 8,
        title: '이 챌린지는 소개글이 없습니다',
        description: '',
        leader: 'user1',
        count: 2,
		isStarred: true
    },
    {
		id: 9,
        title: '챌린지3',
        description: '남의 챌린지입니다',
        leader: 'user2',
        count: 1
    },
];

export const challengeList = writable(initialState);

export async function getChallenge( id ) {
	let res = await fetchGet(`challenges/${id}`)
	if(res.error) {
		// TODO: api 연결된 후에는 에러처리 하기
		res = {name: 'API 연결해죠', description: 'API 연결행', isPrivate: true };
	}
	return res;
}

export async function getAllChallenge() {
	const res = await fetchGet(`challenges`);
	return res;
}

export async function getUserChallenge() {
	const res = await fetchGet(`users/challenge`);
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
