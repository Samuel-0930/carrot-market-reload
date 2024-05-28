'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { smsLogin } from './actions';

type Props = {
	// props의 타입 정의
};

const initialState = {
	token: false,
	error: undefined,
};

const SMSLogin: React.FC<Props> = () => {
	const [state, dispatch] = useFormState(smsLogin, initialState);
	return (
		<div className='flex flex-col gap-10 py-8 px-6'>
			<div className='flex flex-col gap-2 *:font-medium'>
				<h1 className='text-2xl'>SMS Login!</h1>
				<h2 className='text-xl'>Verify your phone number.</h2>
			</div>
			<form
				action={dispatch}
				className='flex flex-col gap-3'>
				<Input
					name='phone'
					type='number'
					placeholder='Phone number'
					required
					errors={state.error?.formErrors}
					className=''
				/>
				<Input
					name='token'
					type='number'
					placeholder='Verification code'
					required
					min={100000}
					max={999999}
					disabled={!state.token}
					className='disabled:cursor-not-allowed'
				/>
				<Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
			</form>
		</div>
	);
};

export default SMSLogin;
