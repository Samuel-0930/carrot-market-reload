"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { IComment } from "../app/posts/[id]/page";
import { formSchema, postType } from "../app/posts/[id]/schema";
import { saveComment } from "../lib/saveComments";
import CommentBox from "./CommentBox";

type Props = {
  // props의 타입 정의
  postId: number;
  comments: IComment[];
  currentUser: {
    id: number;
    username: string;
    avatar: string | null;
  };
};

const CommentField: React.FC<Props> = React.memo(
  ({ postId, comments, currentUser }) => {
    console.log("MyComponent is rendering");
    const {
      register,
      watch,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<postType>({
      resolver: zodResolver(formSchema),
    });

    const currentComment = watch("comment", "");

    const [state, reducerFn] = useOptimistic(comments);

    const onSubmit = () => {
      return onValid();
    };

    const onValid = handleSubmit(async (data: postType) => {
      const newComment = {
        id: state.length > 0 ? state[state.length - 1].id + 1 : 1,
        user: {
          avatar: currentUser.avatar,
          username: currentUser.username,
        },
        payload: data.comment,
      };

      reducerFn([...state, newComment]);

      reset();

      await saveComment(data, postId);
    });

    return (
      <>
        <form
          action={onSubmit}
          className="flex items-center justify-between gap-2"
        >
          <input
            className="flex-1 border-none bg-inherit p-0 focus:ring-0"
            type="text"
            placeholder="댓글 달기..."
            {...register("comment")}
          />
          <div className="flex items-center gap-4">
            <span
              className={`text-xs ${currentComment.length > 300 ? "text-red-500" : "text-gray-500"}`}
            >
              <strong className="">{currentComment.length}</strong>/300
            </span>
            <button className="text-center font-semibold transition-all hover:text-orange-500">
              게시
            </button>
          </div>
        </form>
        {errors.comment && (
          <span className="text-xs font-normal text-red-500">
            {errors.comment.message}
          </span>
        )}
        <hr />
        {state.map((comment) => {
          return <CommentBox key={comment.id} comment={comment} />;
        })}
      </>
    );
  },
);

CommentField.displayName = "CommentField";

export default CommentField;
