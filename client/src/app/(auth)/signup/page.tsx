import RegisterPage from "@/template/RegisterPage";

interface PageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <RegisterPage searchParams={searchParams} />;
}
