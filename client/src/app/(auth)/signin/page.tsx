import LoginPage from "@/template/LoginPage";

interface PageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <LoginPage searchParams={searchParams} />;
}
