'use client';

import { useState } from 'react';
import { InitialProducts } from '../app/(tabs)/products/page';
import ListProduct from './ListProduct';
import { setLazyProp } from 'next/dist/server/api-utils';
import getMoreProducts from '../app/(tabs)/products/action';
import { set } from 'zod';

type Props = {
	initialProducts: InitialProducts;
};

const ProductList: React.FC<Props> = ({ initialProducts }) => {
	const [products, setProducts] = useState(initialProducts);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [lastPage, setLastPage] = useState(false);
	const onLoadMoreClick = async () => {
		setLoading(true);
		const newProducts = await getMoreProducts(page + 1);
		if (newProducts.length !== 0) {
			setPage((prev) => prev + 1);
			setProducts((prev) => [...prev, ...newProducts]);
		} else {
			setLastPage(true);
		}
		setLoading(false);
	};

	return (
		<div className='p-5 flex flex-col gap-5'>
			{products.map((product) => (
				<ListProduct
					key={product.id}
					{...product}
				/>
			))}
			{!lastPage ? (
				<button
					onClick={onLoadMoreClick}
					disabled={loading}
					className='text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95'>
					{loading ? '로딩 중' : 'Load more'}
				</button>
			) : (
				<span>No more items</span>
			)}
		</div>
	);
};

export default ProductList;
