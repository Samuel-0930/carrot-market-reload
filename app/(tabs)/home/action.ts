'use server';

import { ITEMS_PER_PAGE } from '../../../lib/constants';
import db from '../../../lib/db';

const getMoreProducts = async (page: number) => {
	const products = await db.product.findMany({
		select: {
			title: true,
			price: true,
			created_at: true,
			photo: true,
			id: true,
		},
		skip: page * ITEMS_PER_PAGE,
		take: ITEMS_PER_PAGE,
		orderBy: {
			created_at: 'desc',
		},
	});
	return products;
};

export default getMoreProducts;
