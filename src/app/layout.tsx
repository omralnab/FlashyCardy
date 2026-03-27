import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flashy Cardy Course",
  description: "Create, study, and track your flashcards in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
