import { observer } from "mobx-react-lite";
import { Button, Surface } from "@heroui/react";
import { cardHeight, cardWidth } from "@/utils/constants";
import { store } from "@/store/store";
import { TRoomTable } from "@/server/types";
import UserCard from "@/components/user-card";

export const GameTable = observer<{ table: TRoomTable }>((props) => {
  const { table } = props;
  const { userName, currentTableId, isPlaying, isMyTurn, isAdmin } = store;

  const { player, id, secret, typing, isGuessed } = table;

  const isCurrent = currentTableId !== undefined && currentTableId === id;
  const isMyTurnHere = isCurrent && isMyTurn;

  // Блокируем ввод только в этой карточке, если в ней уже печатает другой пользователь
  const isTextareaDisabled = typing !== undefined && typing !== userName;

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
              {isAdmin && (
                <Button variant="danger" onPress={() => store.deleteTable(id)}>
                  Удалить стол
                </Button>
              )}
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
            disabled={isTextareaDisabled || isPlaying}
            onFocus={() => store.setTableTyping(id)}
            onConfirm={(value) => store.setTableSecret(id, value)}
            isCurrent={isCurrent}
            isMyTurn={isMyTurnHere}
            isGuessed={isGuessed}
          />
        );
      })()}
    </Surface>
  );
});
