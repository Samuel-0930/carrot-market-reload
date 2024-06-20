"use server";

import { revalidateTag } from "next/cache";
import db from "../../../lib/db";
import getSession from "../../../lib/session";
import { postType } from "./schema";

export const likePost = async (postId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async (postId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};
