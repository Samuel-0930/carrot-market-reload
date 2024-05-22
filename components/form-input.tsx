type Props = {
	// props의 타입 정의
	type: string;
	placeholder: string;
	required: boolean;
	errors: string[];
};

const FormInput: React.FC<Props> = ({
	type,
	placeholder,
	required,
	errors,
}) => {
	return (
		<div className='flex flex-col gap-2'>
			<input
				type={type}
				placeholder={placeholder}
				required={required}
				className='bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-3 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
			/>
			{errors.map((error, index) => (
				<span
					key={index}
					className='text-red-500 font-medium'>
					{errors}
				</span>
			))}
		</div>
	);
};

export default FormInput;
