import { PhotoIcon } from '@heroicons/react/24/solid';
import ModalCloseButton from '../../../../../../components/ModalCloseButton';

export default async function Modal({ params }: { params: { id: string } }) {
	return (
		<div className='absolute size-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0'>
			<div className='max-w-screen-sm h-1/2 flex justify-center w-full'>
				<ModalCloseButton />
				<div className='aspect-square bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center'>
					<PhotoIcon className='h-28' />
				</div>
			</div>
		</div>
	);
}
