import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landrup Dans",
  description: "Tilmeld dig dine favorit dansehold hos Landrup Dans",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body>
        <div id="app-shell">
        {children}
        </div>
      </body>
    </html>
  );
}
