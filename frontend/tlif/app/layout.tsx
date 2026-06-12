import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SLIIT TLIF Admin Dashboard",
  description: "Teaching and Learning Innovation Fund Administration — 2024 Grant Cycle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
