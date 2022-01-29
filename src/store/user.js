import { writable, get } from 'svelte/store';

export const user = writable(null);

export function login() {
	user.set('llJTOll');
}

export function logout() {
	user.set(null);
}