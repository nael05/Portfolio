import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Cursor } from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naël Morellon — Portfolio",
  description:
    "Étudiant en informatique (B2), orienté Data. Portfolio, projets GitHub, compétences et parcours.",
  keywords: [
    "Naël Morellon",
    "portfolio",
    "informatique",
    "data",
    "développeur",
    "stage",
    "alternance",
  ],
  openGraph: {
    title: "Naël Morellon — Portfolio",
    description:
      "Étudiant en informatique (B2), orienté Data. Portfolio, projets GitHub, compétences et parcours.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LenisProvider>
              <ScrollProgress />
              <main className="relative">{children}</main>
              <Cursor />
            </LenisProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
