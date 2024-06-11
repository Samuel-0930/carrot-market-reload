'use client';

import { useEffect, useRef, useState } from 'react';
import { InitialProducts } from '../app/(tabs)/home/page';
import ListProduct from './ListProduct';
import { setLazyProp } from 'next/dist/server/api-utils';
import getMoreProducts from '../app/(tabs)/home/action';
import { set } from 'zod';

type Props = {
	initialProducts: InitialProducts;
};

const ProductList: React.FC<Props> = ({ initialProducts }) => {
	const [products, setProducts] = useState(initialProducts);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [lastPage, setLastPage] = useState(false);

	const trigger = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			async (
				entries: IntersectionObserverEntry[],
				observer: IntersectionObserver
			) => {
				const element = entries[0];
				if (element.isIntersecting && trigger.current) {
					observer.unobserve(trigger.current);
					setLoading(true);
					const newProducts = await getMoreProducts(page + 1);
					if (newProducts.length !== 0) {
						setPage((prev) => prev + 1);
						setProducts((prev) => [...prev, ...newProducts]);
					} else {
						setLastPage(true);
					}
					setLoading(false);
				}
			},
			{
				threshold: 0.5,
				rootMargin: '0px 0px -100px 0px',
			}
		);
		if (trigger.current) {
			observer.observe(trigger.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [page]);

	return (
		<div className='p-5 flex flex-col gap-5'>
			{products.map((product) => (
				<ListProduct
					key={product.id}
					{...product}
				/>
			))}
			{!lastPage && (
				<span
					ref={trigger}
					className='text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95'>
					{loading ? '로딩 중' : 'Load more'}
				</span>
			)}
		</div>
	);
};

export default ProductList;
