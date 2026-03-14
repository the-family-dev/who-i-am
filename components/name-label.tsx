"use client";

import { store } from "@/store/store";
import { Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";

export const NameLabel = observer(() => {
  const { userName } = store;


  if (userName === undefined) return;

  return (
    <Surface className="px-3 py-2 rounded-lg flex flex-col gap-1">
      <div className="font-medium text-2xl">{userName}</div>
    </Surface>
  );
});
