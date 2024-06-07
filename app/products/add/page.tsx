'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProduct } from './action';
import { useFormState } from 'react-dom';

export default function AddProduct() {
	const [preview, setPreview] = useState('');
	const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { files },
		} = event;
		if (!files) return;

		const file = files[0];

		if (!file.type.startsWith('image/'))
			return alert('이미지만 업로드 가능합니다.');
		if (file.size > 1024 * 1024 * 150)
			return alert('150MB 이하의 이미지만 업로드 가능합니다.');

		const url = URL.createObjectURL(file);

		setPreview(url);
	};

	const interceptAction = async (_: any, formData: FormData) => {
		const file = formData.get('photo');
		if (!file) {
			return;
		}
		const cloudinaryForm = new FormData();
		cloudinaryForm.append('file', file);
		cloudinaryForm.append('upload_preset', 'qvmdrft7');

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: 'POST',
				body: cloudinaryForm,
			}
		);
		if (response.status !== 200) {
			return;
		}
		const data = await response.json();
		console.log(data);
		const photoUrl = data.secure_url;
		formData.set('photo', photoUrl);

		return uploadProduct(_, formData);
	};

	const [state, dispatch] = useFormState(interceptAction, null);
	return (
		<div>
			<form
				action={dispatch}
				className='p-5 flex flex-col gap-5'>
				<label
					htmlFor='photo'
					style={{ backgroundImage: `url(${preview})` }}
					className='border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover'>
					{!preview && (
						<>
							<PhotoIcon className='w-20' />
							<div className='text-neutral-400 text-sm'>
								사진을 추가해주세요.
							</div>
						</>
					)}
				</label>
				<input
					onChange={onImageChange}
					type='file'
					id='photo'
					name='photo'
					accept='image/*'
					className='hidden'
				/>
				<Input
					name='title'
					required
					placeholder='제목'
					type='text'
					errors={state?.fieldErrors.title}
				/>
				<Input
					name='price'
					type='number'
					required
					placeholder='가격'
					errors={state?.fieldErrors.price}
				/>
				<Input
					name='description'
					type='text'
					required
					placeholder='자세한 설명'
					errors={state?.fieldErrors.description}
				/>
				<Button text='작성 완료' />
			</form>
		</div>
	);
}
