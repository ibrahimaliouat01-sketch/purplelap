"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundHud from "./BackgroundHud";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = pathname === "/branding";

  return (
    <>
      {!standalone && <Navbar />}
      {!standalone && <BackgroundHud />}
      {children}
      {!standalone && <Footer />}
    </>
  );
}
