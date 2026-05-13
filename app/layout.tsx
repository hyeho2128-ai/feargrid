import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FearGrid",
  description: "A cinematic journey through market emotion."
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
