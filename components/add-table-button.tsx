import { Button, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { cardHeight, cardWidth } from "../utils/constants";
import { store } from "../store/store";

export const AddTableButton = observer(function AddTableButton() {
  if (!store.isAdmin) return null;

  return (
    <Surface
      className="border border-dashed bg-transparent rounded p-2 flex justify-center items-center"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      <Button onPress={() => store.addTable()}>Добавить стол</Button>
    </Surface>
  );
});
