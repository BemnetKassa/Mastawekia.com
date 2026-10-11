import type { ReactNode } from "react";
import DashboardShell from "../shared/DashboardShell";
import type { DashboardNavLink } from "../shared/DashboardNav";

const navLinks: DashboardNavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/companies", label: "Companies" },
];

type AdminPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onLogout: () => void;
};

export default function AdminPageShell({
  title,
  subtitle,
  children,
  onLogout,
}: AdminPageShellProps) {
  return (
    <DashboardShell
      badge="Admin control center"
      title={title}
      subtitle={subtitle}
      navLabel="Administration"
      navLinks={navLinks}
      actions={
        <button
          onClick={onLogout}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-rose-300/60 hover:text-rose-200"
        >
          Log out
        </button>
      }
    >
      {children}
    </DashboardShell>
  );
}
