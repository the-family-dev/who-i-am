"use client";

import { store } from "@/store/store";
import { Button, Surface } from "@heroui/react";
import { EditIcon, HomeIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export const NameLabel = observer(() => {
  const { userName } = store;

  const router = useRouter();

  if (userName === undefined) return;

  return (
    <Surface className="px-3 py-2 rounded-lg flex flex-col gap-1">
      <div className="font-medium text-2xl">{userName}</div>
    </Surface>
  );
});
