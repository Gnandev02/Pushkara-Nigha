"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const authStatus = localStorage.getItem("pushkara_is_auth") === "true";
    setIsAuth(authStatus);

    if (!authStatus && !isLoginPage) {
      router.push("/login");
    } else if (authStatus && isLoginPage) {
      router.push("/");
    }
  }, [pathname, isLoginPage, router]);

  // Prevent flashing of protected content before auth check completes
  if (isAuth === null) {
    return null; 
  }

  if (isLoginPage) {
    return <div className="w-full min-h-screen relative z-10">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen w-full min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
