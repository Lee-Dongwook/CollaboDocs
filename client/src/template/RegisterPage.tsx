"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      } else {
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("Registration failed:", error);
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
