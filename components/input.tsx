import { InputHTMLAttributes } from 'react';

type Props = {
	// props의 타입 정의
	name: string;
	errors?: string[];
};

const Input: React.FC<Props & InputHTMLAttributes<HTMLInputElement>> = ({
	name,
	errors = [],
	...rest
}) => {
	return (
		<div className='flex flex-col gap-2'>
			<input
				name={name}
				{...rest}
				className='bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-3 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
			/>
			{errors.map((error, index) => (
				<span
					key={index}
					className='text-red-500 font-medium'>
					{error}
				</span>
			))}
		</div>
	);
};

export default Input;
