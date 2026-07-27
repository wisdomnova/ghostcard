import type { Metadata } from "next";
import { Bellota_Text } from "next/font/google";
import "./globals.css";

const bellotaText = Bellota_Text({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-bellota-text",
});

export const metadata: Metadata = {
  title: "Ghostcard",
  description: "Web3 Landing Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bellotaText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

