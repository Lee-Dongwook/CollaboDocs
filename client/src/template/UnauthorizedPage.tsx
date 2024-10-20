"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnAuthorizedPage() {
  const router = useRouter();

  return (
    <section>
      <h1 className="text-red-500 font-semibold">You Are Not Authorized!</h1>
      <Button onClick={() => router.push("/")} className="w-full mt-2">
        Go To Home
      </Button>
    </section>
  );
}
