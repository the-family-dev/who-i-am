"use client";

import { store } from "@/store/store";
import { Button, Surface } from "@heroui/react";
import { EditIcon, HomeIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export const NameLabel = observer(() => {
  const { userName } = store;

  const router = useRouter();

  console.log("NameLabel");

  if (userName === undefined) return;

  return (
    <Surface className="w-fit p-2 border rounded flex flex-row gap-2">
      <Button onPress={() => router.push("/")} variant="ghost" isIconOnly>
        <HomeIcon />
      </Button>
      <div className="font-medium text-2xl">{userName}</div>
      <Button
        onPress={() => router.push("/register")}
        variant="ghost"
        isIconOnly
      >
        <EditIcon />
      </Button>
    </Surface>
  );
});
