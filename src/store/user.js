import { writable, get } from 'svelte/store';
import { push } from 'svelte-spa-router'
import { fetchGet, getQueryUri } from '../common/fetch';

export const user = writable(null);

export async function login() {
	return await fetchGet(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : 'http://localhost:5000/'})}`)
	// push('/');
	user.set('llJTOll');
}

export function logout() {
	user.set(null);
}