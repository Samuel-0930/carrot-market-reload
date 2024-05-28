const getGithubAccessToken = async (code: string) => {
	const accessTokenParams = new URLSearchParams({
		client_id: process.env.GITHUB_CLIENT_ID!,
		client_secret: process.env.GITHUB_CLIENT_SECRET!,
		code,
	}).toString();

	const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

	const accessTokenResponse = await fetch(accessTokenURL, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
	});

	return await accessTokenResponse.json();
};

export default getGithubAccessToken;
