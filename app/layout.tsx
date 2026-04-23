import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Covert — Opioid Risk Intelligence",
  description:
    "Clinical intelligence to identify and eliminate opioid risk embedded in employer health plans.",
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
