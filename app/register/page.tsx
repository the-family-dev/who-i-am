"use client";
import { store } from "@/store/store";
import { Button, Input, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";

export default observer(function Register() {
  const { userName } = store;

  return (
    <Surface
      variant="transparent"
      className="rounded border p-4 flex flex-col gap-4 w-75 h-fit"
    >
      <Input
        value={userName ?? ""}
        onChange={(e) => store.setName(e.target.value)}
        aria-label="name"
        className="w-full"
        placeholder="Введите имя"
        maxLength={20}
      />
      <Button className="w-full" onPress={() => store.register()}>
        Сохранить
      </Button>
    </Surface>
  );
});
