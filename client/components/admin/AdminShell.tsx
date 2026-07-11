"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredToken, getStoredToken } from "@/lib/admin/auth";

const LOGIN_PATH = "/admin/login";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === LOGIN_PATH;
  const [checked, setChecked] = useState(false);

  // Reads localStorage, which only exists client-side, so the auth check
  // can't happen during render without a server/client mismatch.
  useEffect(() => {
    if (isLoginPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecked(true);
      return;
    }
    if (!getStoredToken()) {
      router.replace(LOGIN_PATH);
      return;
    }
    setChecked(true);
  }, [isLoginPage, router]);

  function handleLogout() {
    clearStoredToken();
    router.replace(LOGIN_PATH);
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-paper-muted">{children}</div>;
  }

  if (!checked) {
    return <div className="min-h-screen bg-paper-muted" />;
  }

  return (
    <div className="min-h-screen bg-paper-muted">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin/team" className="font-display text-sm font-bold text-ink">
            Meri Pehchan <span className="text-primary-500">Admin</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/admin/team"
              className="text-sm font-medium text-ink-soft hover:text-primary-500"
            >
              Team
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-ink-soft hover:text-red-600"
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
