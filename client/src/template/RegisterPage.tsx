import { signUpWithCredentials } from "@/lib/authAction";
import RegisterForm from "@/components/RegisterForm";

interface RegisterPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function RegisterPage({
  searchParams: { callbackUrl },
}: RegisterPageProps) {
  return (
    <div className="w-full">
      <RegisterForm
        callbackUrl={callbackUrl || "/"}
        signUpWithCredentials={signUpWithCredentials}
      />
    </div>
  );
}
