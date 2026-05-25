import "./globals.css";
import "../css/style.css";
import "../css/animations.css";
import "../css/responsive.css";
import Sidebar from "@/components/Sidebar";
import SocketProvider from "@/components/SocketProvider";

export const metadata = {
  title: "Pushkara Nigha — AI Crowd Command Center",
  description: "Advanced crowd management and safety reporting platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-theme="dark">
        <SocketProvider>
          <div className="app-container">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Application Interface */}
            <main className="app-main">
              {children}
            </main>
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
