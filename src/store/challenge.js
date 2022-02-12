import { writable, get } from 'svelte/store';

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
        leader: 'user1',
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
];

export const challengeList = writable(initialState);

export async function getChallenge( id ) {
	const res = await fetch(`https://grabit.duckdns.org/api/challenges/${id}`,{
		method: 'GET',	
		credentials: 'include'
	});
	const challenge = await res;
	console.log(challenge);
	return challenge;
}

export async function getAllChallenge() {
	const res = await fetch(`https://grabit.duckdns.org/api/challenges`);
	return res;
}