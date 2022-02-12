const API_URL = 'https://grabit.duckdns.org/api';

export async function fetchGet(path, options = {}) {
	const url = `${API_URL}/${path}`;

	const res = await fetch(url, options)
	const data = await res.json();

	return data;

}

async function fetchPost(path, body, headers = {}) {
	const url = `${API_URL}/${path}`;

	const options = {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		...headers,
	  },
	  body: JSON.stringify(body),
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

/* 사용법
  fetchPost("/hi", {
	title: "Test",
	body: "I am testing!",
	userId: 1,
  })
	.then((data) => console.log(data))
	.catch((error) => console.log(error));
*/