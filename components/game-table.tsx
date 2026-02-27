import { Button, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { cardHeight, cardWidth } from "../utils/constants";

export const GameTable = observer(() => {
  return (
    <Surface
      className=" border rounded p-2 flex justify-center items-center"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      <Button>Занять стол</Button>
    </Surface>
  );
});
