import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: "700",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drisyamn Siliguri",
  description: "Discover, Search, Explore, Connect, Promote, Showcase in Siliguri",
  manifest: "/manifest.json",
  themeColor: "#ff6b00",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} bg-[#F6F1EB]`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
export const viewport = {
  themeColor: "#EDE6D3",
}