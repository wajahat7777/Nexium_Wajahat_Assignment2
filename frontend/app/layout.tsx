import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Blog Summarizer - Transform Blogs into Intelligent Summaries",
  description: "Transform any blog into concise summaries with intelligent insights and instant Urdu translations. Lightning fast, free, and beautiful.",
  keywords: ["smart", "blog summarizer", "urdu translation", "intelligent summary", "content analysis"],
  authors: [{ name: "Smart Blog Summarizer Team" }],
  creator: "Smart Blog Summarizer",
  publisher: "Smart Blog Summarizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nexium-wajahat-assignment2.vercel.app"),
  openGraph: {
    title: "Smart Blog Summarizer - Transform Blogs into Intelligent Summaries",
    description: "Transform any blog into concise summaries with intelligent insights and instant Urdu translations.",
    url: "https://nexium-wajahat-assignment2.vercel.app",
    siteName: "Smart Blog Summarizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Blog Summarizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Blog Summarizer - Transform Blogs into Intelligent Summaries",
    description: "Transform any blog into concise summaries with intelligent insights and instant Urdu translations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
