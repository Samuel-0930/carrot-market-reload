'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { revalidatePath } from 'next/cache';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { editProduct } from '../../add/action';
import { ProductType, productSchema } from '../../add/schema';
import { useParams } from 'next/navigation';

export default function EditProduct() {
	const [preview, setPreview] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const { id } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
	} = useForm<ProductType>({
		resolver: zodResolver(productSchema),
	});

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
		setFile(file);
		setValue('photo', url);
	};

	const onSubmit = handleSubmit(async (data: ProductType) => {
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

		const dataJson = await response.json();
		const photoUrl = dataJson.secure_url;

		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('price', data.price + '');
		formData.append('description', data.description);
		formData.append('photo', photoUrl);

		const errors = await editProduct(formData, +id);
		if (errors) {
			// setError("")
		}
		revalidatePath('/home');
		revalidatePath('/products/[id]', 'page');
	});

	const onValid = async () => {
		await onSubmit();
	};

	return (
		<div>
			<form
				action={onValid}
				className='p-5 flex flex-col gap-5'>
				<label
					htmlFor='photo'
					style={{ backgroundImage: `url(${preview})` }}
					className='border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover'>
					{!preview && (
						<>
							<PhotoIcon className='w-20' />
							<div className='text-neutral-400 text-sm'>
								{errors.photo?.message}
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
					required
					placeholder='제목'
					type='text'
					{...register('title')}
					errors={[errors.title?.message ?? '']}
				/>
				<Input
					type='number'
					required
					placeholder='가격'
					{...register('price')}
					errors={[errors.price?.message ?? '']}
				/>
				<Input
					type='text'
					required
					placeholder='자세한 설명'
					{...register('description')}
					errors={[errors.description?.message ?? '']}
				/>
				<Button text='작성 완료' />
			</form>
		</div>
	);
}
