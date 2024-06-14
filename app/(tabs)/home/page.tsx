import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import ProductList from "../../../components/ProductList";
import db from "../../../lib/db";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import { ITEMS_PER_PAGE } from "../../../lib/constants";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

export const revalidate = 30;

async function getInitialProducts() {
  console.log("hit!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      id: true,
      created_at: true,
    },
    take: ITEMS_PER_PAGE,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

export default async function Products() {
  const initialProducts = await getCachedProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="fixed bottom-24 right-4 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
