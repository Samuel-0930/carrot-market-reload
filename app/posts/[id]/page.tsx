import { EyeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "../../../components/LikeButton";
import db from "../../../lib/db";
import getSession from "../../../lib/session";
import { formatToTomeAgo } from "../../../lib/utils";
import CommentForm from "../../../components/CommentForm";
import CommentBox from "../../../components/CommentBox";
import CommentField from "../../../components/CommentField";

type Props = {
  params: {
    id: string;
  };
};

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export type IComment = {
  id: number;
  user: {
    avatar: string | null;
    username: string;
  };
  payload: string;
};

const getComments = async (postId: number): Promise<IComment[]> => {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      payload: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return comments;
};

const getCachedComments = nextCache(getComments, ["comments"], {
  tags: ["post-comments"],
  revalidate: 60,
});

const findUser = async () => {
  const session = await getSession();
  const currentUser = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return currentUser;
};

const PostDetail: React.FC<Props> = async ({ params }) => {
  const id = +params.id;

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const currentUser = await findUser();
  const comments = await getCachedComments(id);

  return (
    <div className="flex flex-col gap-3 p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTomeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentField
        postId={id}
        comments={comments}
        currentUser={currentUser!}
      />
    </div>
  );
};

export default PostDetail;
