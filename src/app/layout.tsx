"use client";

import "./globals.css";
import { Montserrat } from "next/font/google";

import React from "react";
import Image from "next/image";

import CenterMenu from "./(components)/CenterMenu";
import ContactDrawer from "./(components)/ContactDrawer";
import LoadCPU from "./(components)/LoadCPU";
import LoadMemory from "./(components)/LoadMemory";
import LoadDisk from "./(components)/LoadDisk";

const Montserrat_init = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opend, setOpend] = React.useState(false);
  const toggleDrawer = () => setOpend((cur) => !cur);

  return (
    <html lang="en">
      <head>
        <title>MS Solutions IWS</title>
        <meta name="description" content="The MS Dashboard to easily manage IWS devices centrally on a network." />
        <meta name="author" content="Marvin Wulf @ MS Solutions" />
      </head>

      <body>
        <div className="container font-ms font-medium text-ms-fg">
          <header className="flex items-center justify-start">
            <link href="https://cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css" rel="stylesheet"></link>

            <div className="flex items-center">
              <Image alt="Logo" src="/mslogo.svg" width={50} height={32.8167} />
              <text className="text-3xl ml-3 solutions-text cursor-default select-none">SOLUTIONS</text>
            </div>

            <div className="flex-1 text-center">
              <CenterMenu />
            </div>

            <div className="flex items-center solutions-text justify-end" style={{ width: "241.75px", height: "36px" }}>
              <div className="button-1 text-sm cursor-pointer">Docs</div>
              <div className="button-1 text-sm cursor-pointer">Über Uns</div>
              <div className="button-1 text-sm cursor-pointer" onClick={toggleDrawer}>
                Kontakt
              </div>
            </div>

            <div className="flex items-center ms-dummy">
              <div style={{ width: "50px", height: "32.35px" }}></div>
            </div>
          </header>

          <main>{children}</main>

          <footer>
            <div className="flex items-center w-full ml-4 gap-4">
              <LoadCPU />
              <LoadMemory />
              <LoadDisk />
            </div>
          </footer>

          <ContactDrawer opend={opend} setOpend={setOpend}></ContactDrawer>
        </div>
      </body>
    </html>
  );
}
