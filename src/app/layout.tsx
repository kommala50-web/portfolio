import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { generateSeoMetadata, personSchema } from "@/lib/seo";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
  display:  "swap",
});

export const metadata: Metadata = generateSeoMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={jetbrainsMono.variable}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
