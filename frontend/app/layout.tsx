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
  keywords: ["smart", "blog summarizer", "urdu translation", "intelligent summary", "content analysis", "AI", "text summarization", "urdu language"],
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
    creator: "@smartblogsummarizer",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://nexium-wajahat-assignment2.vercel.app",
  },
  category: "technology",
  classification: "AI-powered text summarization tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Smart Blog Summarizer" />
        <meta name="application-name" content="Smart Blog Summarizer" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
