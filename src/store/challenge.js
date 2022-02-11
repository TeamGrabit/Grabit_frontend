import { writable, get } from 'svelte/store';

export const user = writable(null);

export function getChallenge() {
	
}

export function getAllChallenge() {
	const res = await fetch(`https://https://grabit.duckdns.org/api/challenges`);
	return res;
}