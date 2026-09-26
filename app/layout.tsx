import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drisyamn Siliguri",
  description: "Discover, Explore and Connect Siliguri",
};

export const viewport: Viewport = {
  themeColor: "#EDE6D3",
  backgroundColor: "#EDE6D3",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: "#EDE6D3" }}>
      <body style={{ background: "#EDE6D3", margin: 0 }}>{children}</body>
    </html>
  );
}