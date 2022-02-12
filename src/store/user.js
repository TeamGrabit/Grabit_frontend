import { writable, get } from 'svelte/store';
import { push } from 'svelte-spa-router'
import { fetchGetRedirectUrl, getQueryUri } from '../common/fetch';

export const user = writable(null);

export async function login() {
	await fetchGetRedirectUrl(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : 'http://localhost:5000/#/redirect'})}`, {redirect: 'manual'})
}

export function logout() {
	user.set(null);
	localStorage.removeItem('accessToken');
}

export function setUserToken() {
	const url = location.href;
	const token = url.split('?')[1].split('=')[1].split('#')[0];

	if(!token) window.location.href = '/#/login';
	localStorage.setItem('accessToken', token);
	window.location.href = '/';
}

export function setUser() {
	user.set('tnghd5761');
}