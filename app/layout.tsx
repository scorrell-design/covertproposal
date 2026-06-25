import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-full min-h-screen antialiased">
        <ClerkProvider appearance={{ variables: { colorPrimary: "#14B8A6" } }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
