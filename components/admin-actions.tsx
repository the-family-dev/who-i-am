import { GameStates } from "@/server/types";
import { store } from "@/store/store";
import { Button, ListBox, Popover, Select } from "@heroui/react";
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
  const { room, userName } = store;

  if (room === undefined) return null;

  const isAdmin =
    room.spectators.some(
      (user) => user.name === userName && user.isAdmin === true,
    ) ||
    room.tabels.some((table) => {
      const player = table.player;
      return player !== undefined && player.name === userName && player.isAdmin === true;
    });

  if (!isAdmin) return null;

  const { state } = room;

  return (
    <Popover>
      <Button variant="secondary" className="shrink-0">
        Управление комнатой
      </Button>
      <Popover.Content placement="bottom" className="min-w-64">
        <Popover.Dialog>
          <div className="flex flex-col gap-3 p-1">
            <Select
            variant='secondary'
              className={"w-full"}
              placeholder="Состояние игры"
              value={state}
              onChange={(value) => {
                if (!isValidGameState(value)) return;

                store.setRoomState(value);
              }}
              aria-label="Состояние игры"
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
                className="w-full"
                onPress={() => store.nextTurn()}
              >
                Следующий ход
              </Button>
            ) : null}
            <Button
              variant="secondary"
              className="w-full"
              onPress={() => store.restartGame()}
            >
              Рестарт игры
            </Button>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
});
