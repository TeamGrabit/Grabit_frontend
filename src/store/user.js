import { writable } from 'svelte/store';
import { ACCESS_TOKEN, CALLBACK_URL } from '../common/Variable';
import { fetchGet, fetchGetRedirectUrl, getQueryUri } from '../common/fetch';

const tempUser = {
	githubId: 'MOBUMIN',
}

export const user = writable(null);

export async function login() {
	await fetchGetRedirectUrl(`oauth2/authorization/github?${getQueryUri({ 'redirect_uri' : CALLBACK_URL+'#/redirect'})}`, {redirect: 'manual'})
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

	window.location.href = url.split('?')[0];
}

export async function getUser() {
	// TODO: 로그인 실패시 토스트 알럿 띄우기
	const userData = await fetchGet('users');
	if(userData.err) failLogin();
	else user.set(userData);
}
