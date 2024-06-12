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
			className='absolute right-0 top-0 z-50 text-neutral-800'>
			<XMarkIcon className='size-8' />
		</button>
	);
};

export default ModalCloseButton;
