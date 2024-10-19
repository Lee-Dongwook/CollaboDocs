"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import API from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleLogin = async () => {
    const loginData = {
      email,
      password,
    };

    try {
      const { data } = await API.post("/api/auth/login", loginData);
      saveToken(data.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
}
