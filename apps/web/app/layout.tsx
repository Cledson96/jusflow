import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "JurisFlow",
  description: "CRM juridico com IA para pre-atendimento trabalhista"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
