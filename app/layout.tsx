import type { Metadata } from "next";
import { Ubuntu } from "next/font/google"
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap", //browser viser med det samme en fallback font - og swapper til Ubuntu, så snart den er loadet
  //Det hjælper også på Core Web Vitals-scoren (FCP — First Contentful Paint).
})

export const metadata: Metadata = {
  title: {
     template: "%s | Landrup Dans", //%s placeholder will be replaced by the page title defined in each page
    default: "Landrup Dans"
  },
  description: "Tilmeld dig dine favorit dansehold hos Landrup Dans",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={ubuntu.variable}>
      <body>
        <div id="app-shell">
        {children}
        </div>
      </body>
    </html>
  );
}
