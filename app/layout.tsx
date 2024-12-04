import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body className="min-h-screen bg-background antialiased">
        <NextTopLoader showSpinner={false} color="#3b82f6" shadow={false} />
        {children}
      </body>
    </html>
  );
}
