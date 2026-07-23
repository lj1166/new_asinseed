import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";

import "./globals.css";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata: Metadata = {
  title: "ASINSeed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={workSans.variable}>{children}</body>
    </html>
  );
}
