import { writable, get } from 'svelte/store';
import { fetchGet } from '../common/fetch';
import { notifications } from './notifications.js';

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
    {
		id: 10,
        title: '챌린지3',
        description: '남의 챌린지입니다',
        leader: 'user2',
        count: 1
    },
    {
		id: 11,
        title: '챌린지3',
        description: '남의 챌린지입니다',
        leader: 'user2',
        count: 1
    },
];

export const challengeList = writable(initialState);

export async function getChallenge( id ) {
	const res = await fetchGet(`challenges/${id}`)
	return res;
}

export async function getAllChallenge() {
	const res = await fetchGet(`challenges`);
    //const res = await fetchGet('challenges?page=0&size=5) 형태로  이후 수정
    
    if(res.error)
        failGetChallenge();
    else
        challengeList.set(res);
}

function failGetChallenge(){
    notifications.send("불러오기 실패!  다시 시도해주세요!");
}

