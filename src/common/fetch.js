import { API_URL, ACCESS_TOKEN } from "./Variable";

function getHeader() {
	const bearer = 'Bearer ' + window.localStorage.getItem(ACCESS_TOKEN);
	return { 'Authorization': bearer };
}

const bearer = getHeader();

export function getQueryUri(params = {}) {
	const query = Object.keys(params)
				.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
				.join('&');
	return query;
}

export async function fetchGet(path, otherOptions = {}, headers = {}) {
	const url = `${API_URL}/${path}`;

	const options = {
		method: 'GET',
		headers: {
			...bearer,
			...headers,
		},
		...otherOptions
	}
	
	let data;

	try{
		const res = await fetch(url, options);
		data = await res.json();
	} catch(error) {
		data = { err: error.name, errMsg: error.message }
	}

	return data;
}

export async function fetchGetRedirectUrl(path, options = {}) {
	const url = `${API_URL}/${path}`;

	const res = await fetch(url, options)

	window.location.href = res.url;
}

export async function fetchPost(path, body, otherOptions = {}, headers = {}) {
	const url = `${API_URL}/${path}`;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...bearer,
			...headers,
		},
		body: JSON.stringify(body),
		...otherOptions
	};

	const res = await fetch(url, options);
	const data = await res.json();

	/* TODO: Error 처리
		if (res.ok) {
			return data;
		} else {
			throw Error(data);
		}
	*/

	return data;
}
export async function fetchPostFormData(path, body, otherOptions = {}, headers = {}) {

	const url = `${API_URL}/${path}`;
	const options = {
		method: "POST",
		headers: {
			...bearer,
			...headers,
		},
		body: body,
		...otherOptions
	};

	const res = await fetch(url, options);
	const data =await res.json();
	return data;
}

export async function fetchPut(path, body, otherOptions = {}, headers = {}) {
	const url = `${API_URL}/${path}`;

	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...bearer,
			...headers,
		},
		body: JSON.stringify(body),
		...otherOptions
	};

	const res = await fetch(url, options)
	const data = await res.json();

	return data;
}

export async function fetchPatch(path, body, otherOptions = {}, headers = {}) {
	const url = `${API_URL}/${path}`;

	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...bearer,
			...headers,
		},
		body: JSON.stringify(body),
		...otherOptions
	};

	const res = await fetch(url, options)
	const data = await res.json();

	return data;
}

export async function fetchDelete(path, otherOptions = {}, headers = {}) {
	const url = `${API_URL}/${path}`;

	const options = {
		method: "DELETE",
		headers: {
			...bearer,
			...headers
		},
		...otherOptions
	};

	const res = await fetch(url, options)
	const data = await res.json();

	return data;
}
