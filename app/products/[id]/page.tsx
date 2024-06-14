import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import db from "../../../lib/db";
import getSession from "../../../lib/session";
import { formatToWon } from "../../../lib/utils";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";

type Props = {
  // props의 타입 정의
  params: { id: string };
};

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
};

const getProduct = async (id: number) => {
  console.log("product");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
};

const getProductTitle = async (id: number) => {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
};

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(+params.id);
  return {
    title: product?.title,
  };
}

const ProductDetail: React.FC<Props> = async ({ params }) => {
  const id = Number(params.id);

  const getCachedProduct = nextCache(
    (id) => getProduct(id),
    ["product-detail"],
    {
      tags: ["product-detail"],
    },
  );

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const deleteProduct = async () => {
    "use server";
    if (!isOwner) return;

    await db.product.delete({
      where: {
        id: product.id,
      },
    });
    revalidatePath("/home");
    revalidatePath("/products/[id]", "page");
    redirect("/home");
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={product.photo}
          alt={product.title}
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 flex w-full max-w-screen-sm items-center justify-between bg-neutral-800 p-5 pb-5">
        <span className="text-xl font-semibold">
          {formatToWon(product.price)}원
        </span>
        {isOwner && (
          <form action={deleteProduct}>
            <button className="rounded-md bg-red-500 px-3 py-2.5 font-semibold text-white transition-colors hover:bg-red-400">
              Delete product
            </button>
          </form>
        )}
        {isOwner && (
          <Link
            href={`/products/${id}/edit`}
            className="rounded-md bg-green-500 px-3 py-2.5 font-semibold text-white transition-colors hover:bg-green-400"
          >
            Edit product
          </Link>
        )}
        <Link
          className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-orange-400"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
