import { UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react"; // Add this line

type Props = {
  // props의 타입 정의
  comment: {
    id: number;
    user: {
      avatar: string | null;
      username: string;
    };
    payload: string;
  };
};

const CommentBox: React.FC<Props> = React.memo(({ comment }) => {
  return (
    <li className="flex items-center gap-4">
      {comment?.user.avatar !== "http://img" ? (
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={comment?.user.avatar!}
          alt={comment?.user.username}
        />
      ) : (
        <UserCircleIcon
          width={28}
          height={28}
          className="size-7 rounded-full"
        />
      )}
      <div>
        <span className="text-xs font-medium">{comment?.user.username}</span>
        <p className="line-clamp-1 text-sm font-normal">{comment?.payload}</p>
      </div>
    </li>
  );
});

CommentBox.displayName = "CommentBox";

export default CommentBox;
