import { writable } from 'svelte/store';
import { ACCESS_TOKEN } from '../common/Variable';
import { fetchGet, fetchGetRedirectUrl, getQueryUri } from '../common/fetch';

export const user = writable(null);

export async function login() {
	await fetchGetRedirectUrl(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : 'http://localhost:5000/#/redirect'})}`, {redirect: 'manual'})
}

export function logout() {
	user.set(null);
	localStorage.removeItem(ACCESS_TOKEN);
}

function failLogin() {
	window.location.href = '/#/login'
}

export function setUserToken() {
	const url = location.href;
	const token = url.split('?')[1].split('=')[1].split('#')[0];

	// TODO: 로그인 실패시 토스트 알럿 띄우기
	if(!token) failLogin();
	localStorage.setItem(ACCESS_TOKEN, token);
	window.location.href = '/';
}

export async function getUser() {
	// TODO: 로그인 실패시 토스트 알럿 띄우기
	const userData = await fetchGet('users');
	if(userData.error) failLogin();
	else user.set(userData);
}
