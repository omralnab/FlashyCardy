import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800`}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur">
              <div className="text-sm font-semibold tracking-tight text-slate-100">
                Flashy Cardy Course
              </div>
              <nav className="flex items-center gap-3">
                <Show when="signed-out">
                  <div className="flex items-center gap-3">
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button size="sm">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </nav>
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
