import { Button, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { cardHeight, cardWidth } from "../utils/constants";
import { store } from "@/store/store";
import { TRoomTable } from "@/server/types";
import UserCard from "./user-card";
import { toJS } from "mobx";

export const GameTable = observer<{ table: TRoomTable }>((props) => {
  const { table } = props;
  const { userName, room } = store;

  const { player, id, secret, typing, isGuessed } = table;

  const isCurrent =
    room !== undefined && room.currentTableId !== undefined
      ? room.currentTableId === id
      : false;
  const isMyTurn = isCurrent && player !== undefined && player.name === userName;

  const isSomeTyping =
    room !== undefined
      ? room.tabels.some((t) => t.typing !== undefined)
      : false;
  const isTypingHere = typing !== undefined;

  const isTextareaDisabled = isSomeTyping && !isTypingHere;

  console.log(toJS(table));

  return (
    <Surface
      className="border rounded-xl p-2 flex justify-center items-center"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {(() => {
        if (player === undefined) {
          return (
            <div className="flex flex-col gap-2">
              <Button onPress={() => store.takeTable(id)}>Занять стол</Button>
              <Button variant="danger" onPress={() => store.deleteTable(id)}>
                Удалить стол
              </Button>
            </div>
          );
        }

        const typingUserName =
          typing !== undefined && typing !== userName ? typing : undefined;

        return (
          <UserCard
            user={player}
            secret={secret}
            hidden={player.name === userName && !isGuessed}
            typingUserName={typingUserName}
            disabled={isTextareaDisabled}
            onFocus={() => store.setTableTyping(id)}
            onConfirm={(value) => store.setTableSecret(id, value)}
            isCurrent={isCurrent}
            isMyTurn={isMyTurn}
            isGuessed={isGuessed}
          />
        );
      })()}
    </Surface>
  );
});
