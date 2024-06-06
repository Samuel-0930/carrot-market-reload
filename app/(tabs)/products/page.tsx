import { Prisma } from '@prisma/client';
import ListProduct from '../../../components/ListProduct';
import db from '../../../lib/db';
import ProductList from '../../../components/ProductList';

const getInitialProducts = async () => {
	const products = await db.product.findMany({
		select: {
			title: true,
			price: true,
			created_at: true,
			photo: true,
			id: true,
		},
		take: 1,
		orderBy: {
			created_at: 'desc',
		},
	});
	return products;
};

export type InitialProducts = Prisma.PromiseReturnType<
	typeof getInitialProducts
>;

export default async function Products() {
	const initialProducts = await getInitialProducts();
	return (
		<div>
			<ProductList initialProducts={initialProducts} />
		</div>
	);
}
