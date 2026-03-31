'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export type DashboardNavLink = {
  href: string;
  label: string;
  hint?: string;
};

type DashboardNavProps = {
  label: string;
  links: DashboardNavLink[];
};

export default function DashboardNav({ label, links }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="glass-panel rounded-3xl px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Move between your workspace sections.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${isActive
                    ? "border-amber-300/60 bg-amber-300/10 text-amber-200"
                    : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
