import { writable, get } from 'svelte/store';

export const user = writable(null);

export function login() {
	user.set('임시 유저');
}

export function logout() {
	user.set(null);
}