"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "../app/posts/[id]/action";

type Props = {
  // props의 타입 정의
  isLiked: boolean;
  likeCount: number;
  postId: number;
};

const LikeButton: React.FC<Props> = ({ isLiked, likeCount, postId }) => {
  const [state, reducerFn] = useOptimistic({ isLiked, likeCount }, (prev) => {
    return {
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    };
  });

  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors ${state.isLiked ? "border-orange-500 bg-orange-500 text-white" : "hover:bg-neutral-800"}`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
};

export default LikeButton;
