"use client";

import { useForm } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  callbackUrl?: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const { pending } = useFormStatus();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Sign In"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-2">
        Don&apos;t have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signup">
          Sign Up
        </Link>
      </p>
    </Form>
  );
}
