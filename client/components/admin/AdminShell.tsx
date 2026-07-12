"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiBars3,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Logo } from "@/components/layout/Logo";
import { clearStoredToken, getStoredToken } from "@/lib/admin/auth";

const LOGIN_PATH = "/admin/login";

const NAV_ITEMS = [
  { href: "/admin/team", label: "Team", icon: HiOutlineUserGroup },
  { href: "/admin/events", label: "Events", icon: HiOutlineCalendarDays },
  { href: "/admin/messages", label: "Messages", icon: HiOutlineEnvelope },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === LOGIN_PATH;
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close the mobile sidebar on every navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false);
  }, [pathname]);

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
    <div className="flex min-h-screen bg-paper-muted">
      {sidebarOpen ? (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 -translate-x-full flex-col border-r border-black/5 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/5 px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="text-ink-soft hover:text-ink lg:hidden"
          >
            <HiOutlineXMark size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-500"
                    : "text-ink-soft hover:bg-paper-muted hover:text-ink"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/5 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineArrowRightOnRectangle size={20} />
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-black/5 bg-white px-4 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-ink-soft hover:text-ink"
          >
            <HiBars3 size={22} />
          </button>
          <span className="font-display text-sm font-bold text-ink">
            Meri Pehchan <span className="text-primary-500">Admin</span>
          </span>
        </header>

        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
