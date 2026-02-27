import { observer } from "mobx-react-lite";
import { TUser } from "@/server/types";
import { Avatar } from "@heroui/react";
import { CrownIcon, GlobeOffIcon } from "lucide-react";

export const SpectatorCard = observer<{ user: TUser }>((props) => {
  const { user } = props;

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col ">
        <div className="flex flex-row gap-2 font-semibold items-center">
          {user.isAdmin && <CrownIcon className="size-4 text-amber-500" />}
          {user.name}
          {user.disconnected && (
            <GlobeOffIcon className="size-4 text-slate-500" />
          )}
        </div>
      </div>
      <div />
    </div>
  );
});
