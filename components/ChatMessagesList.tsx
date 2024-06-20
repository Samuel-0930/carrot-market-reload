"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { InitialChatMessages } from "../app/chats/[id]/page";
import Image from "next/image";
import { formatToTomeAgo } from "../lib/utils";

type Props = {
  // props의 타입 정의
  initialMessages: InitialChatMessages;
  userId: number;
};

const ChatMessagesList: React.FC<Props> = ({ initialMessages, userId }) => {
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div className={`flex min-h-screen flex-col justify-end gap-5 p-5`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${message.userId === userId && "justify-end"}`}
        >
          {message.userId !== userId &&
            (message.user.avatar ? (
              <Image
                src={message.user.avatar!}
                alt={message.user.username}
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            ) : (
              <UserIcon className="h-8 w-8 rounded-full" />
            ))}
          <div
            className={`flex flex-col gap-1 ${message.userId === userId && "items-end"}`}
          >
            <span
              className={`rounded-md p-2.5 ${message.userId === userId ? "bg-gray-500" : "bg-orange-500"}`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTomeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessagesList;
