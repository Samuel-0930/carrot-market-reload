import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import getGithubAccessToken from '../../../../lib/getGithubAccessToken';
import getGithubUserData from '../../../../lib/getGithubUserProfile';
import userLogin from '../../../../lib/userLogin';
import db from '../../../../lib/db';

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get('code');

	if (!code) {
		return notFound();
	}

	const { error, access_token } = await getGithubAccessToken(code);

	if (error) {
		return new Response(null, {
			status: 400,
		});
	}

	const { id, avatar_url, login } = await getGithubUserData(access_token);

	const user = await db.user.findUnique({
		where: {
			github_id: id + '',
		},
		select: {
			id: true,
		},
	});

	if (user) {
		await userLogin(user.id);
		return redirect('/profile');
	}

	const dbUser = await db.user.findUnique({
		where: {
			username: login.toLowerCase(),
		},
		select: {
			id: true,
		},
	});

	if (!dbUser) {
		const newUser = await db.user.create({
			data: {
				github_id: id + '',
				avatar: avatar_url,
				username: login.toLowerCase(),
			},
			select: {
				id: true,
			},
		});

		await userLogin(newUser.id);
		return redirect('/profile');
	}

	let count = 1;

	while (true) {
		console.log(count);
		const newUsername = login + `#${count}`;
		const dbUser = await db.user.findUnique({
			where: {
				username: newUsername.toLowerCase(),
			},
			select: {
				id: true,
			},
		});

		if (!dbUser) {
			const newUser = await db.user.create({
				data: {
					github_id: id + '',
					avatar: avatar_url,
					username: newUsername.toLowerCase(),
				},
				select: {
					id: true,
				},
			});

			await userLogin(newUser.id);
			return redirect('/profile');
		} else {
			count++;
		}
	}
}
