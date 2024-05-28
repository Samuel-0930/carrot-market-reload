const getGithubUserProfile = async (access_token: string) => {
	const userProfileResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-cache',
	});

	return await userProfileResponse.json();
};

export default getGithubUserProfile;
