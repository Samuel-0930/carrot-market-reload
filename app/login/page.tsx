import FormButton from '@/components/form-btn';
import FormInput from '@/components/form-input';
import SocialLogin from '@/components/social-login';

type Props = {
	// props의 타입 정의
};

const Login: React.FC<Props> = () => {
	return (
		<div className='flex flex-col gap-10 py-8 px-6'>
			<div className='flex flex-col gap-2 *:font-medium'>
				<h1 className='text-2xl'>안녕하세요!</h1>
				<h2 className='text-xl'>Log in with email and password.</h2>
			</div>
			<form className='flex flex-col gap-3'>
				<FormInput
					type='email'
					placeholder='Email'
					required
					errors={[]}
				/>
				<FormInput
					type='password'
					placeholder='Password'
					required
					errors={[]}
				/>
				<FormButton
					loading={false}
					text='Login'
				/>
			</form>
			<SocialLogin />
		</div>
	);
};

export default Login;
