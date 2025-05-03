import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components";

export const metadata: Metadata = {
  title: "Upper Primary School Warpora Mawer",
  description: "Welcome to UPS Warpora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={""}>
        <Navbar />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
