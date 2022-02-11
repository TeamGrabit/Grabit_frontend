import { writable, get } from 'svelte/store';

export const tabIndex = writable(0);

export function changeTab(index) {
	tabIndex.set(index);
}