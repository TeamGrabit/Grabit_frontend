import { writable, get } from 'svelte/store';
import { push } from 'svelte-spa-router'

export const user = writable(null);

export function login() {
	push('/');
	user.set('llJTOll');
}

export function logout() {
	user.set(null);
}