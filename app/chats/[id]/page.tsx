import { notFound } from "next/navigation";
import db from "../../../lib/db";
import getSession from "../../../lib/session";

type Props = {
  // props의 타입 정의
  params: { id: string };
};

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

const ChatRoom: React.FC<Props> = async ({ params }) => {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  return <h1>chat!</h1>;
};

export default ChatRoom;
