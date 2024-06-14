import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ModalCloseButton from '../../../../../../components/ModalCloseButton';
import db from '../../../../../../lib/db';
import { formatToWon } from '../../../../../../lib/utils';

export default async function Modal({ params }: { params: { id: string } }) {
	const { id } = params;
	const getProduct = async (id: number) => {
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
	const product = await getProduct(Number(id));

	if (!product) {
		return notFound();
	}

	return (
		<div className='absolute size-full z-50 flex items-center justify-center bg-black bg-opacity-80 left-0 top-0'>
			<div className='max-w-screen-md h-4/5 flex flex-col justify-center w-full bg-neutral-900 drop-shadow-2xl'>
				<ModalCloseButton />
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
				<div className='max-w-screen-sm w-full p-5 pb-5 flex justify-between items-center'>
					<span className='font-semibold text-xl'>
						{formatToWon(product.price)}원
					</span>
				</div>
			</div>
		</div>
	);
}
