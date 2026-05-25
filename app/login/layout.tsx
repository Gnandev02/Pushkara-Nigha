// Login route segment - renders without sidebar/SocketProvider
// This layout overrides the root layout for /login

export default function LoginRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
