import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { themeInitScript } from "@/lib/theme";
import { siteUrl } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  /* Resolves the relative canonical / openGraph URLs used on sub-pages.
     No custom domain yet — set NEXT_PUBLIC_SITE_URL in the host's environment
     (Vercel or Firebase) and every canonical and OG URL follows it. */
  metadataBase: new URL(siteUrl),
  title: "Subashkrishnan K | 3D Modeler, Web, App, Windows & AR/VR Developer",
  description:
    "Portfolio of Subashkrishnan K — AI & ML Engineering graduate and multi-discipline developer from Salem, Tamil Nadu, India. Skilled in 3D modeling (Blender), web development (Next.js/React), mobile apps (Flutter/Android), Windows desktop apps (Electron), and AR/VR (Unity/Unreal). Open to full-time opportunities.",
  keywords: [
    "Subashkrishnan K",
    "Subashkrishnan",
    "3D Modeler",
    "Web Developer",
    "App Developer",
    "Windows App Developer",
    "AR/VR Developer",
    "Unity Developer",
    "Flutter Developer",
    "React Developer",
    "Next.js Developer",
    "Blender Artist",
    "Electron Developer",
    "Portfolio",
    "Salem",
    "India",
    "Open to Work",
    "Freshers",
  ],
  authors: [{ name: "Subashkrishnan K" }],
  openGraph: {
    title: "Subashkrishnan K | 3D Modeler, Web, App, Windows & AR/VR Developer",
    description:
      "Portfolio of Subashkrishnan K — AI & ML graduate and multi-discipline developer skilled in 3D modeling, web, mobile, desktop, and AR/VR development. Open to full-time opportunities.",
    /* Relative — resolved against metadataBase, so it follows the deploy URL. */
    url: "/",
    siteName: "Subashkrishnan K Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subashkrishnan K | 3D Modeler, Web, App, Windows & AR/VR Developer",
    description:
      "Portfolio of Subashkrishnan K — AI & ML graduate and multi-discipline developer skilled in 3D modeling, web, mobile, desktop, and AR/VR development. Open to full-time opportunities.",
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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} antialiased`}
      /* Next 16 no longer overrides `scroll-behavior: smooth` during
         navigation unless asked — without this, route changes animate the
         scroll to top instead of jumping. */
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint. Must run ahead of
            hydration, so it cannot be a component. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
