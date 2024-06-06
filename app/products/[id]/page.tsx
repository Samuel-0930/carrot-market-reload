type Props = {
	// props의 타입 정의
	params: { id: string };
};

const getProduct = async () => {
	await new Promise((resolve) => setTimeout(resolve, 60000));
};

const ProductDetail: React.FC<Props> = async ({ params: { id } }) => {
	const product = await getProduct();
	return <span>Product detail of the product {id}</span>;
};

export default ProductDetail;
