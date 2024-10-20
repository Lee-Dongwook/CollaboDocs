/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import API from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const handleRegister = async () => {
    const registerData = {
      email,
      password,
      username,
    };

    try {
      await API.post("/api/auth/register", registerData);

      router.push("/login");
    } catch (error: any) {
      if (error.response) {
        console.error("Registration failed", error.response.data);
      }
      console.error("Registration failed", error.message);
    }
  };

  return (
    <RegisterForm
      email={email}
      password={password}
      username={username}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onUsernameChange={setUsername}
      onSubmit={handleRegister}
    />
  );
}
