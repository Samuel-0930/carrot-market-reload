'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

type Props = {
	// props의 타입 정의
};

const ModalCloseButton: React.FC<Props> = () => {
	const router = useRouter();
	const onClick = () => {
		router.back();
	};
	return (
		<button
			onClick={onClick}
			className='absolute right-5 top-5 text-neutral-200'>
			<XMarkIcon className='size-10' />
		</button>
	);
};

export default ModalCloseButton;
