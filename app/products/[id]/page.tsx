import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import db from '../../../lib/db';
import getSession from '../../../lib/session';
import { formatToWon } from '../../../lib/utils';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';

type Props = {
	// props의 타입 정의
	params: { id: string };
};

const getIsOwner = async (userId: number) => {
	// const session = await getSession();
	// if (session.id) {
	// 	return session.id === userId;
	// }
};

const getProduct = async (id: number) => {
	console.log('product');
	const product = await db.product.findUnique({
		where: {
			id,
		},
		include: {
			user: {
				select: {
					username: true,
					avatar: true,
				},
			},
		},
	});
	return product;
};

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
	tags: ['product-detail'],
});

const getProductTitle = async (id: number) => {
	console.log('title');
	const product = await db.product.findUnique({
		where: {
			id,
		},
		select: {
			title: true,
		},
	});
	return product;
};

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
	tags: ['product-title'],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
	const product = await getCachedProductTitle(+params.id);
	return {
		title: product?.title,
	};
}

const ProductDetail: React.FC<Props> = async ({ params }) => {
	const id = Number(params.id);

	if (isNaN(id)) {
		return notFound();
	}

	const product = await getCachedProduct(id);

	if (!product) {
		return notFound();
	}

	const isOwner = await getIsOwner(product.userId);

	// const deleteProduct = async () => {
	// 	'use server';
	// 	if (!isOwner) return;

	// 	await db.product.delete({
	// 		where: {
	// 			id: product.id,
	// 		},
	// 	});
	// 	redirect('/products');
	// };

	// const revalidate = async () => {
	// 	'use server';
	// 	revalidateTag('product-title');
	// };

	return (
		<div>
			<div className='relative aspect-square'>
				<Image
					className='object-cover'
					fill
					src={product.photo}
					alt={product.title}
				/>
			</div>
			<div className='p-5 flex items-center gap-3 border-b border-neutral-700'>
				<div className='size-10 overflow-hidden rounded-full'>
					{product.user.avatar !== null ? (
						<Image
							src={product.user.avatar}
							width={40}
							height={40}
							alt={product.user.username}
						/>
					) : (
						<UserIcon />
					)}
				</div>
				<div>
					<h3>{product.user.username}</h3>
				</div>
			</div>
			<div className='p-5'>
				<h1 className='text-2xl font-semibold'>{product.title}</h1>
				<p>{product.description}</p>
			</div>
			<div className='fixed max-w-screen-sm w-full bottom-0 p-5 pb-5 bg-neutral-800 flex justify-between items-center'>
				<span className='font-semibold text-xl'>
					{formatToWon(product.price)}원
				</span>
				{/* {isOwner ? (
					<form action={revalidate}>
						<button className='bg-red-500 hover:bg-red-400 transition-colors px-5 py-2.5 rounded-md text-white font-semibold'>
							Revalidate title cache
						</button>
					</form>
				) : null} */}
				<Link
					className='bg-orange-500 hover:bg-orange-400 transition-colors px-5 py-2.5 rounded-md text-white font-semibold'
					href={``}>
					채팅하기
				</Link>
			</div>
		</div>
	);
};

export const dynamicParams = false;

export async function generateStaticParams() {
	const products = await db.product.findMany({
		select: {
			id: true,
		},
	});

	return products.map((products) => ({ id: products.id + '' }));
}

export default ProductDetail;
