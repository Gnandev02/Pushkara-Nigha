import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SocketProvider } from "@/components/SocketProvider";

export const metadata: Metadata = {
  title: "Pushkara Nigha — AI Crowd Command Center",
  description:
    "Government of Andhra Pradesh ICCC AI-powered real-time crowd analytics and monitoring platform for Godavari Pushkaralu ghats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "#F4F6F9" }}>
        <SocketProvider>
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
        </SocketProvider>
      </body>
    </html>
  );
}
