import type { ReactNode } from "react";

import DashboardNav, { type DashboardNavLink } from "./DashboardNav";

type DashboardShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  navLabel: string;
  navLinks: DashboardNavLink[];
  actions?: ReactNode;
  children: ReactNode;
};

export default function DashboardShell({
  badge,
  title,
  subtitle,
  navLabel,
  navLinks,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-100% space-y-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              {badge}
            </p>
            <h1 className="font-display text-3xl text-white">{title}</h1>
            <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        <DashboardNav label={navLabel} links={navLinks} />

        {children}
      </div>
    </div>
  );
}
