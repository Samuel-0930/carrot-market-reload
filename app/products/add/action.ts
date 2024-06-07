'use server';

const uploadProduct = async (formData: FormData) => {
	const data = {
		photo: formData.get('photo'),
		title: formData.get('title'),
		price: formData.get('price'),
		description: formData.get('description'),
	};
	console.log(data);
};

export default uploadProduct;
