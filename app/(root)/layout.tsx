import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "../globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });
const ibmPlexSerif = IBM_Plex_Serif(
  {
    subsets : ['latin'],
    weight : ['400','700'],
    variable: '--font-ibm-plex-serif'
  }
);
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
      <body  className={`${inter.className} ${ibmPlexSerif.variable}`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
