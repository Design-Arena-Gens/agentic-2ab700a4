import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn Post Agent",
  description: "AI-powered LinkedIn post generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
