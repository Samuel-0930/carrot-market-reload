'use server';

import fs from 'fs/promises';
import { z } from 'zod';
import db from '../../../lib/db';
import getSession from '../../../lib/session';
import { redirect } from 'next/navigation';

const productSchema = z.object({
	photo: z.string({
		required_error: '사진을 추가해주세요.',
	}),
	title: z.string({
		required_error: '제목을 입력해주세요.',
	}),
	description: z.string({
		required_error: '설명을 입력해주세요.',
	}),
	price: z.coerce.number({
		required_error: '가격을 입력해주세요.',
	}),
});

export const uploadProduct = async (_: any, formData: FormData) => {
	const data = {
		photo: formData.get('photo'),
		title: formData.get('title'),
		price: formData.get('price'),
		description: formData.get('description'),
	};
	if (data.photo instanceof File) {
		const photoData = await data.photo.arrayBuffer();
		await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
		data.photo = `/${data.photo.name}`;
	}
	const result = productSchema.safeParse(data);
	if (!result.success) {
		return result.error.flatten();
	} else {
		const session = await getSession();
		if (session.id) {
			const product = await db.product.create({
				data: {
					title: result.data.title,
					description: result.data.description,
					price: result.data.price,
					photo: result.data.photo,
					user: {
						connect: {
							id: session.id,
						},
					},
				},
				select: {
					id: true,
				},
			});
			redirect(`/products/${product.id}`);
		}
	}
	console.log(data);
};
