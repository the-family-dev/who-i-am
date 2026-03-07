import { GameStates } from "@/server/types";
import { store } from "@/store/store";
import { Button, Label, ListBox, Select } from "@heroui/react";
import { observer } from "mobx-react-lite";

const states = [
  {
    value: GameStates.Idle,
    title: "Ожидание",
  },
  {
    value: GameStates.Playing,
    title: "Игра",
  },
];

const GameStatesValues = Object.values(GameStates);

function isValidGameState(state: unknown): state is GameStates {
  return (
    typeof state === "string" && GameStatesValues.includes(state as GameStates)
  );
}

export const AdminActions = observer(() => {
  const { room } = store;

  if (room === undefined) return null;

  const { state } = room;

  return (
    <div className="flex flex-row gap-2 items-center">
      <Select
        className={"w-40"}
        placeholder="Select a state"
        value={state}
        onChange={(value) => {
          if (!isValidGameState(value)) return;

          store.setRoomState(value);
        }}
        aria-label="Select a state"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {states.map((state) => (
              <ListBox.Item
                key={state.value}
                id={state.value}
                textValue={state.title}
              >
                {state.title}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {state === GameStates.Playing ? (
        <Button
          variant="secondary"
          className="shrink-0"
          onPress={() => store.nextTurn()}
        >
          Следующий ход
        </Button>
      ) : null}
      <Button
        variant="secondary"
        className="shrink-0"
        onPress={() => store.restartGame()}
      >
        Рестарт игры
      </Button>
    </div>
  );
});
