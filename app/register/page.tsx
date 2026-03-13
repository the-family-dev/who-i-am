"use client";
import { store } from "@/store/store";
import { Button, Input, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";

export default observer(function Register() {
  const { userName } = store;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    store.register();
  };

  return (
    <Surface
      variant="transparent"
      className="rounded border p-4 flex flex-col gap-4 w-75 h-fit"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          value={userName ?? ""}
          onChange={(e) => store.setName(e.target.value)}
          aria-label="name"
          className="w-full"
          placeholder="Введите имя"
          maxLength={20}
        />
        <Button type="submit" className="w-full">
          Сохранить
        </Button>
      </form>
    </Surface>
  );
});
