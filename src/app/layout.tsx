import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniShop - University Student Lifestyle & Essentials",
  description: "Minimalist, stylish campus essentials for university students. Backpacks, watches, hoodies, and daily tech gear with fast campus delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <CartDrawer />
            <CheckoutModal />
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
