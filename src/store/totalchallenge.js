import { writable } from 'svelte/store';

const challenge = [
    {
        name: '챌린지1 입니다.',
        intro: '내 챌린지입니다',
        host: 'llJTOll',
        numpeople: 3
    },
    {
        name: '이 챌린지는 소개글이 없습니다',
        intro: '',
        host: 'user1',
        numpeople: 2
    },{
        name: '챌린지3',
        intro: '남의 챌린지입니다',
        host: 'user2',
        numpeople: 1
    }, //임시입니다. DB에서 목록 받아오기
];

export const challengelist = writable(challenge);



