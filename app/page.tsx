"use client";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default observer(function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4">
      <LoginForm />
      <Button
        variant="secondary"
        size="sm"
        onPress={() => router.push("/register")}
      >
        {t("home.changeName")}
      </Button>
    </div>
  );
});
