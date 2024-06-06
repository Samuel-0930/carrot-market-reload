'use client';

import { useState } from 'react';
import { InitialProducts } from '../app/(tabs)/products/page';
import ListProduct from './ListProduct';
import { setLazyProp } from 'next/dist/server/api-utils';
import getMoreProducts from '../app/(tabs)/products/action';

type Props = {
	initialProducts: InitialProducts;
};

const ProductList: React.FC<Props> = ({ initialProducts }) => {
	const [products, setProducts] = useState(initialProducts);
	const [loading, setLoading] = useState(false);
	const onLoadMoreClick = async () => {
		setLoading(true);
		const newProducts = await getMoreProducts(1);
		setProducts((prev) => [...prev, ...newProducts]);
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
			<button
				onClick={onLoadMoreClick}
				disabled={loading}
				className='text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95'>
				{loading ? '로딩 중' : 'Load more'}
			</button>
		</div>
	);
};

export default ProductList;
