import Image from 'next/image';
import Link from 'next/link';
import { formatToTomeAgo, formatToWon } from '../lib/utils';

type Props = {
	// props의 타입 정의title
	title: string;
	price: number;
	created_at: Date;
	photo: string;
	id: number;
};

const ListProduct: React.FC<Props> = ({
	title,
	price,
	created_at,
	photo,
	id,
}) => {
	return (
		<Link
			href={`/products/${id}`}
			className='flex gap-5'>
			<div className='relative size-28 rounded-md overflow-hidden'>
				<Image
					fill
					src={photo}
					alt={title}
					quality={100}
				/>
			</div>
			<div className='flex flex-col gap-1 *:text-white'>
				<span className='text-lg'>{title}</span>
				<span className='text-sm text-neutral-500'>
					{formatToTomeAgo(created_at.toString())}
				</span>
				<span className='text-lg font-semibold'>{formatToWon(price)}원</span>
			</div>
		</Link>
	);
};

export default ListProduct;
