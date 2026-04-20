import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Diya's Nail Art — Premium Press-On Nails",
  description: "Handcrafted luxury press-on nails. Salon-quality at home. Shop wedding, party, and everyday nail sets.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
