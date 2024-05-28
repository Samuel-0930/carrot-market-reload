import getSession from './session';

const userLogin = async ({ id }: { id: number }) => {
	const session = await getSession();
	session.id = id;
	await session.save();
};

export default userLogin;
