"use client";
import { store } from "@/store/store";
import { Button, Input, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";

export default observer(function Register() {
  const { userName } = store;

  const trimmedName = userName?.trim() ?? "";
  const isInvalid = trimmedName === "";

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isInvalid) return;
    store.register();
  };

  return (
    <Surface
      variant="transparent"
      className="rounded border p-4 flex flex-col gap-4 w-75 h-fit"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 w-full">
          <Input
            value={userName ?? ""}
            onChange={(e) => store.setName(e.target.value)}
            aria-label="name"
            aria-invalid={isInvalid}
            className="w-full"
            placeholder="Введите имя"
            maxLength={20}
          />
          {isInvalid ? (
            <p className="text-danger text-sm">Введите имя</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" isDisabled={isInvalid}>
          Сохранить
        </Button>
      </form>
    </Surface>
  );
});
