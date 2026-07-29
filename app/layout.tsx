import type { Metadata } from "next";
import { Bellota_Text } from "next/font/google";
import "./globals.css";

const bellotaText = Bellota_Text({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-bellota-text",
});

// PLACEHOLDER: Replace 'https://your-domain-here.com' with your actual production URL when ready
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain-here.com";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "GhostCard | Physical Crypto Mastercard & Privacy Cards",
    template: "%s | GhostCard",
  },
  description:
    "Physical Mastercard funded with crypto built for cash access, everyday spending, and total privacy with no KYC required.",
  keywords: [
    "Crypto Card",
    "Physical Mastercard",
    "No-KYC Card",
    "Anonymous Card",
    "Crypto ATM",
    "Web3 Banking",
  ],
  openGraph: {
    title: "GhostCard | Physical Crypto Mastercard",
    description: "Your Money. Your Rules. No-KYC Physical Mastercard funded with crypto.",
    url: DOMAIN,
    siteName: "GhostCard",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Sitelinks & Navigation
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GhostCard",
    "url": DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${DOMAIN}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const sitelinksSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Features",
        "description": "Real plastic NFC physical card shipped discreetly.",
        "url": `${DOMAIN}/#features`,
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Pricing & Conditions",
        "description": "Transparent $500 activation & 6% flat top-up fee.",
        "url": `${DOMAIN}/#pricing`,
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Contact Support",
        "description": "Connect with encrypted SimpleX Chat or official Telegram.",
        "url": `${DOMAIN}/contact`,
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${bellotaText.variable} h-full antialiased`}
    >
      <head>
        {/* Google Sitelinks & Search Action Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

