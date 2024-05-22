type Props = {
	// props의 타입 정의
	loading: boolean;
	text: string;
};

const FormButton: React.FC<Props> = ({ loading, text }) => {
	return (
		<button
			disabled={loading}
			className='primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed'>
			{loading ? 'Loading...' : text}
		</button>
	);
};

export default FormButton;
