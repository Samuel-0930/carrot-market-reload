import { notFound } from "next/navigation";
import db from "../../../lib/db";
import getSession from "../../../lib/session";
import { Prisma } from "@prisma/client";
import ChatMessagesList from "../../../components/ChatMessagesList";
import { get } from "lodash";

type Props = {
  // props의 타입 정의
  params: { id: string };
};

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }

  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId: chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

const ChatRoom: React.FC<Props> = async ({ params }) => {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(params.id);

  const session = await getSession();

  const user = await getUserProfile();

  if (!user) {
    return notFound();
  }

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessages={initialMessages}
    />
  );
};

export default ChatRoom;
