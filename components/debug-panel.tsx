"use client";

import { Button, Popover } from "@heroui/react";
import { Bug } from "lucide-react";
import { store } from "@/store/store";



export function DebugPanel() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Popover>
        <Button
          variant="outline"
          isIconOnly
          className="opacity-60 hover:opacity-100"
          aria-label="Открыть меню дебага"
        >
          <Bug size={20} />
        </Button>
        <Popover.Content placement="top" className="min-w-48">
          <Popover.Dialog>
            <div className="flex flex-col gap-1 py-1 gap-4">
              <div className="px-2 py-1 text-xs text-neutral-500 border-b border-neutral-700">
                Тестовые действия
              </div>
              <div className="flex flex-col gap-1">
                <Button onPress={() => store.triggerConfetti()}>конфети</Button>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

