import { Button, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { cardHeight, cardWidth } from "../utils/constants";
import { store } from "@/store/store";
import { TRoomTable } from "@/server/types";
import UserCard from "./user-card";

export const GameTable = observer<{ table: TRoomTable }>((props) => {
  const { table } = props;

  const { player, id } = table;

  return (
    <Surface
      className=" border rounded p-2 flex justify-center items-center"
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

        return <UserCard user={player} secret="test" />;
      })()}
    </Surface>
  );
});
