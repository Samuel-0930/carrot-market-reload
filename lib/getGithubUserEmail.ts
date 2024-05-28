const getGithubUserEmail = async (access_token: string) => {
	const userEmailResponse = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-cache',
	});

	return await userEmailResponse.json();
};

export default getGithubUserEmail;
