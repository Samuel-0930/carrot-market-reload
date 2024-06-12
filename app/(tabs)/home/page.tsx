import { Prisma } from '@prisma/client';
import ListProduct from '../../../components/ListProduct';
import db from '../../../lib/db';
import ProductList from '../../../components/ProductList';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';

const getInitialProducts = async () => {
	const products = await db.product.findMany({
		select: {
			title: true,
			price: true,
			created_at: true,
			photo: true,
			id: true,
		},
		// take: 1,
		orderBy: {
			created_at: 'desc',
		},
	});
	return products;
};

export type InitialProducts = Prisma.PromiseReturnType<
	typeof getInitialProducts
>;

export const metadata = {
	title: 'Home',
};

export default async function Products() {
	const initialProducts = await getInitialProducts();
	return (
		<div>
			<ProductList initialProducts={initialProducts} />
			<Link
				href='/products/add'
				className='bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-4 text-white transition-colors hover:bg-orange-400'>
				<PlusIcon className='size-10' />
			</Link>
		</div>
	);
}
