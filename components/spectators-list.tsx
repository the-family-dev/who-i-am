import { observer } from "mobx-react-lite";
import { SpectatorCard } from "./spectator-card";
import { Button, Popover } from "@heroui/react";
import { UsersIcon } from "lucide-react";
import { store } from "@/store/store";

export const SpectatorsList = observer(() => {
  const { room } = store;

  if (room === undefined) {
    return null;
  }

  return (
    <Popover>
      <Button className={"shrink-0"} variant="secondary" isIconOnly>
        <UsersIcon size={16} />
      </Button>
      <Popover.Content placement={"left bottom"} className="max-w-64">
        <Popover.Dialog>
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {room.spectators.map((user) => (
                <SpectatorCard key={user.socketId} user={user} />
              ))}
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
});
