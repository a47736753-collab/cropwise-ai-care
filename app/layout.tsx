import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CropWise AI — AI Crop Disease Detection",
  description:
    "Photograph a leaf. Know the disease in seconds. Upload a crop photo and get an AI diagnosis with a confidence score, treatment plan and prevention steps — in your own language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
