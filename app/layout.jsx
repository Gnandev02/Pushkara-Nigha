import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SocketProvider from "@/components/SocketProvider";

export const metadata = {
  title: "NeuralCrowd — Advanced AI Crowd Analytics CommandCenter",
  description: "Real-time GPU-accelerated video telemetry and crowd management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="grid-bg min-h-screen">
        <SocketProvider>
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Application Interface */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col p-8 transition-all duration-300">
              {children}
            </main>
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
