import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function AppLayout({ children }) {
  return (
    <AuthProvider requireAuth>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
