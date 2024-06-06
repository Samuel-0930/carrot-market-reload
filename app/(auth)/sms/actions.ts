'use server';

import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';

import crypto from 'crypto';

import twilio from 'twilio';
import db from '../../../lib/db';
import userLogin from '../../../lib/userLogin';

const phoneSchema = z
	.string()
	.trim()
	.refine(
		(phone) => validator.isMobilePhone(phone, 'ko-KR'),
		'Wrong phone format'
	);

const tokenExists = async (token: number) => {
	const exists = await db.sMSToken.findUnique({
		where: {
			token: token.toString(),
		},
		select: {
			id: true,
		},
	});
	return Boolean(exists);
};

const tokenSchema = z.coerce
	.number()
	.min(100000)
	.max(999999)
	.refine(tokenExists, 'This token does not exist!');

interface ActionState {
	token: boolean;
}

async function getToken() {
	const token = crypto.randomInt(100000, 999999).toString();
	const exists = await db.sMSToken.findUnique({
		where: { token },
		select: {
			id: true,
		},
	});
	if (exists) {
		return getToken();
	} else {
		return token;
	}
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
	const phone = formData.get('phone');
	const token = formData.get('token');
	if (!prevState.token) {
		const result = phoneSchema.safeParse(phone);
		if (!result.success) {
			return { token: false, error: result.error.flatten() };
		} else {
			await db.sMSToken.deleteMany({
				where: {
					user: {
						phone: result.data,
					},
				},
			});
			const token = await getToken();
			await db.sMSToken.create({
				data: {
					token,
					user: {
						connectOrCreate: {
							where: {
								phone: result.data,
							},
							create: {
								username: crypto.randomBytes(10).toString('hex'),
								phone: result.data,
							},
						},
					},
				},
			});
			const client = twilio(
				process.env.TWILIO_ACCOUNT_SID,
				process.env.TWILIO_AUTH_TOKEN
			);
			await client.messages.create({
				body: `Your Karrot verification code is ${token}`,
				from: process.env.TWILIO_PHONE_NUMBER!,
				to: process.env.MY_PHONE_NUMBER!,
			});
			return { token: true };
		}
	} else {
		const result = await tokenSchema.spa(token);
		if (!result.success) {
			return {
				token: true,
				error: result.error.flatten(),
			};
		} else {
			const token = await db.sMSToken.findUnique({
				where: {
					token: result.data.toString(),
				},
				select: {
					id: true,
					userId: true,
				},
			});

			await userLogin(token!.userId);
			await db.sMSToken.delete({
				where: {
					id: token!.id,
				},
			});
			redirect('/profile');
		}
	}
}
