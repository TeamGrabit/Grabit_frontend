import { writable, get } from 'svelte/store';
const url = "https://cors-anywhere.herokuapp.com"

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