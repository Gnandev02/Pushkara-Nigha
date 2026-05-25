"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <div className="w-full min-h-screen relative z-10">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Offset content by sidebar width */}
      <main
        className="flex-1 min-h-screen transition-all duration-300"
        style={{ marginLeft: "240px" }}
      >
        {children}
      </main>
    </div>
  );
}
