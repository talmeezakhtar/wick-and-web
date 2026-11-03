import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartDrawer from "@/components/cart-drawer";
import SpiderLoader from "@/components/spider-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wick & Web",
  description: "Candles, mugs, and soft things, poured and stitched slow. Spun with a little help from our resident spider.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="ssd-root">
            <SiteHeader />
            {children}
            <SiteFooter />
            <CartDrawer />
            <SpiderLoader bounceColor="#e8691f" shadowColor="#2a1206" seedWebs={18} />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
