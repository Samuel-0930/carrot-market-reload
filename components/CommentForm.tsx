"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, postType } from "../app/posts/[id]/schema";
import { saveComment } from "../lib/saveComments";

type Props = {
  // props의 타입 정의
  postId: number;
};

const CommentForm: React.FC<Props> = ({ postId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<postType>({
    resolver: zodResolver(formSchema),
  });

  const comment = watch("comment", "");

  const onSubmit = () => {
    return onValid();
  };

  const onValid = handleSubmit((data: postType) => {
    reset();
    return saveComment(data, postId);
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
            className={`text-xs ${comment.length > 300 ? "text-red-500" : "text-gray-500"}`}
          >
            {comment.length}/300
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
    </>
  );
};

export default CommentForm;
