import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"],
  fallback: ['system-ui', 'sans-serif'],
 });

export const metadata = {
  title: "True Feedback",
  description: "Anonymous feedback platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
