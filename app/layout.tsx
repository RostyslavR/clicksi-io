import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { getServerLanguage } from "@/lib/server-language";
// import "./globals.css";
import "@/app/styles/index.css"
import "@/app/styles/syntax-highlighting.css"

export const metadata: Metadata = {
  title: "Clicksi - Connect Brands with Creators | Turn Content into Income",
  description: "Platform connecting brands and creators for authentic partnerships. Join beta for exclusive access to influencer marketing made simple.",
  keywords: "beauty brands,creators,influencer marketing,Ukraine,collaborations",
  authors: [{ name: "Clicksi" }],
  creator: "Clicksi",
  openGraph: {
    title: "Clicksi - Connect Brands with Creators",
    description: "Where Ukrainian beauty brands and creators unite to create impactful collaborations",
    url: "https://clicksi.io",
    siteName: "Clicksi",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://clicksi.io/dark-icon.png",
        width: 1200,
        height: 630,
        alt: "Clicksi - Connect Brands with Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@clicksi",
    title: "Clicksi - Connect Brands with Creators",
    description: "Where Ukrainian beauty brands and creators unite to create impactful collaborations",
    images: ["https://clicksi.io/dark-icon.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "16x16" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#D78E59" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-title": "Clicksi",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLanguage = await getServerLanguage()
  
  return (
    <html lang={initialLanguage.code}>
      <body className="bg-[#171717] text-[#EDECF8] min-h-screen flex flex-col dark antialiased font-sans">
        <LanguageProvider initialLanguage={initialLanguage}>
          <AuthProvider>
            <EditModeProvider>
              <ToastProvider>
                {children}
                <ConditionalFooter />
              </ToastProvider>
            </EditModeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
