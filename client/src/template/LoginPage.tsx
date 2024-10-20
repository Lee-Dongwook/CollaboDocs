import LoginForm from "@/components/LoginForm";

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function LoginPage({
  searchParams: { callbackUrl },
}: LoginPageProps) {
  return (
    <div className="w-full">
      <LoginForm callbackUrl={callbackUrl || "/"} />
    </div>
  );
}
