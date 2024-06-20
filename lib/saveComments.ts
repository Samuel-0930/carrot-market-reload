"use server";
import { revalidateTag } from "next/cache";
import { postType } from "../app/posts/[id]/schema";
import db from "./db";
import getSession from "./session";

export async function saveComment(data: postType, postId: number) {
  const session = await getSession();
  try {
    const comment = await db.comment.create({
      data: {
        payload: data.comment,
        userId: session.id!,
        postId: postId,
      },
    });

    if (comment) {
      revalidateTag("post-comments");
    }
  } catch (e) {}
}
