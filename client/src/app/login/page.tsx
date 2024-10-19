"use client";

import { useState } from "react";
import { useRouter } from "next/router";
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
    <div className="p-4">
      <h1 className="text-2xl">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mt-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mt-2 w-full"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4">
        Login
      </button>
    </div>
  );
}
