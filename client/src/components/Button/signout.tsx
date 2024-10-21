"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const signout = () => {
    signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/signin`,
    });
  };

  return (
    <Button onClick={signout} variant="destructive">
      Sign Out
    </Button>
  );
}
