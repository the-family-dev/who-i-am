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
            <Button onPress={() => store.takeTable(id)}>Занять стол</Button>
          );
        }

        return <UserCard user={player} secret="test" />;
      })()}
    </Surface>
  );
});
