import "./globals.css";
import SocketProvider from "@/components/SocketProvider";
import LayoutShell from "@/components/LayoutShell";

export const metadata = {
  title: "Pushkara Nigha — AI Crowd Command Center",
  description:
    "Government of Andhra Pradesh ICCC AI-powered real-time crowd analytics and monitoring platform for Godavari Pushkaralu ghats.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "#F4F6F9" }}>
        <SocketProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </SocketProvider>
      </body>
    </html>
  );
}
