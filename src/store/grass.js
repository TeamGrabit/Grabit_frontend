export async function getGrass( id ) {
	const url = `https://2hefmq4b0a.execute-api.ap-northeast-2.amazonaws.com/crawlingGithub?${id}`
	const options = {
		method: 'GET',
	}
	const res = await fetch(url, options)
	const data = await res.json();
	return data;
}