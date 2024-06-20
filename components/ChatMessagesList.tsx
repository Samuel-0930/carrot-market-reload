"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { InitialChatMessages } from "../app/chats/[id]/page";
import Image from "next/image";
import { formatToTomeAgo } from "../lib/utils";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";

type Props = {
  // props의 타입 정의
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
};

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ2R4bG1kZHVyam1ld3Z0cHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4NjMwNDUsImV4cCI6MjAzNDQzOTA0NX0.JcQ_17drBvMInM_ihb-Re2OoTapoxki7QLkWByW6UDQ";
const SUPABASE_URL = "https://xggdxlmddurjmewvtpry.supabase.co";

const ChatMessagesList: React.FC<Props> = ({
  initialMessages,
  userId,
  chatRoomId,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "You",
          avatar: null,
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: { message },
    });
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        console.log(payload);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className={`flex min-h-screen flex-col justify-end gap-5 p-5`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${message.userId === userId && "justify-end"}`}
        >
          {message.userId !== userId &&
            (message.user.avatar !== "http://img" ? (
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
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-50"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
};

export default ChatMessagesList;
