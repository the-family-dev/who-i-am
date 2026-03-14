import { Button, Surface } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { cardHeight, cardWidth } from "../utils/constants";
import { store } from "../store/store";
import { useTranslation } from "react-i18next";

export const AddTableButton = observer(function AddTableButton() {
  const { t } = useTranslation();
  if (!store.isAdmin) return null;

  return (
    <Surface
      className="border border-dashed bg-transparent rounded p-2 flex justify-center items-center"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      <Button onPress={() => store.addTable()}>{t("table.add")}</Button>
    </Surface>
  );
});
