/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Monitoring Theme
        govNavy: "#071827",
        govGreen: "#0B6B53",
        govTeal: "#0D9488",
        govBg: "#F4F6F9",
        govCard: "#FFFFFF",
        govBorder: "#E2E8F0",
        govText: "#0F172A",
        govMuted: "#64748B",
        govSecondary: "#475569",
        // Status colours
        safeGreen: "#10B981",
        safeBg: "rgba(16,185,129,0.08)",
        warnOrange: "#D97706",
        warnBg: "rgba(217,119,6,0.08)",
        busyOrange: "#EA580C",
        busyBg: "rgba(234,88,12,0.08)",
        critRed: "#DC2626",
        critBg: "rgba(220,38,38,0.08)",
        // Sidebar
        sidebarBg: "#071827",
        sidebarText: "#94A3B8",
        sidebarBorder: "rgba(255,255,255,0.08)",
        // Legacy neon (kept for SocketProvider badge compatibility)
        neonPurple: "#9d4edd",
        neonBlue: "#00b4d8",
        neonPink: "#ff007f",
        darkBg: "#060212",
        glassBorder: "rgba(157,78,221,0.2)",
      },
      boxShadow: {
        govSm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        govMd: "0 4px 6px -1px rgba(0,0,0,0.05)",
        govPremium: "0 4px 12px 0 rgba(15,23,42,0.06)",
        govCard: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
      },
      animation: {
        blink: "blink 1.2s ease-in-out infinite",
        scanline: "scanline 3s linear infinite",
        "crit-pulse": "critPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        critPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
}
