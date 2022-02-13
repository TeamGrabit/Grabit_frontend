import { writable } from 'svelte/store';
import { ACCESS_TOKEN } from '../common/Variable';
import { fetchGet, fetchGetRedirectUrl, getQueryUri } from '../common/fetch';

export const user = writable(null);
export const token = writable(null);

export async function login() {
	await fetchGetRedirectUrl(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : 'http://localhost:5000/#/redirect'})}`, {redirect: 'manual'})
}

export function logout() {
	user.set(null);
	localStorage.removeItem(ACCESS_TOKEN);
}

export function setUserToken() {
	const url = location.href;
	const token = url.split('?')[1].split('=')[1].split('#')[0];

	if(!token) window.location.href = '/#/login';
	localStorage.setItem(ACCESS_TOKEN, token);
	window.location.href = '/';
	token.setItem(token)
	user.setItem('tnghd5761');
}

export async function getUser() {
	const a = await fetchGet('users')
	user.set(a);
}