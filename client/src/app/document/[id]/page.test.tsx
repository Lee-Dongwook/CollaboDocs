import { render, screen } from "@testing-library/react";
import DocumentPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/socket", () => ({
  connect: jest.fn(),
  emit: jest.fn(),
  on: jest.fn(),
  disconnect: jest.fn(),
}));

describe("DocumentPage", () => {
  it("renders Document ID", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DocumentPage params={{ id: "test-id" }} />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Document ID: test-id/)).toBeIntheDocument();
  });

  it("renders loading state initially", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DocumentPage params={{ id: "test-id" }} />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });
});
