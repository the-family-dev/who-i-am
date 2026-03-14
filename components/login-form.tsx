"use client";

import { observer } from "mobx-react-lite";
import {
  Button,
  Form,
  Input,
  Label,
  Surface,
  Tabs,
  TextField,
} from "@heroui/react";
import { LoginType, store } from "@/store/store";

export const LoginForm = observer(() => {
  const { userName, loginForm } = store;
  const { roomCode, type } = loginForm;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type === LoginType.Join) {
      store.joinRoom();

      return;
    }

    store.createRoom();
  };
  return (
    <Surface
      variant="transparent"
      className="w-120 rounded-3xl border p-6 flex flex-col gap-4"
    >
      <div className="text-3xl font-bold text-center pb-4">Кто я</div>
      <Tabs
        onSelectionChange={(key) =>
          store.setLoginFormField("type", key as LoginType)
        }
        variant="primary"
        selectedKey={type}
      >
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id={LoginType.Join}>Присоединиться</Tabs.Tab>
            <Tabs.Tab id={LoginType.Create}>Создать игру</Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {type === LoginType.Join ? (
          <TextField variant="secondary" name="name" type="text">
            <Label>Код комнаты</Label>
            <Input
              value={roomCode}
              onChange={(e) =>
                store.setLoginFormField("roomCode", e.target.value)
              }
              placeholder="Код комнаты"
              variant="secondary"
            />
          </TextField>
        ) : null}
        <Button
          isDisabled={userName === undefined}
          className={"w-full"}
          type="submit"
        >
          {type === LoginType.Join ? "Присоединиться" : "Создать"}
        </Button>
      </Form>
    </Surface>
  );
});
