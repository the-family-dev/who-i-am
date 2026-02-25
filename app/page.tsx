"use client";
import { observer } from "mobx-react-lite";
import { LoginForm } from "@/components/login-form";

export default observer(function Home() {
  return <LoginForm />;
});
