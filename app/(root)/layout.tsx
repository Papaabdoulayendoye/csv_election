import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
title: "E-Vote",
description: "E-Vote is a modern Electronic platform for every election",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
