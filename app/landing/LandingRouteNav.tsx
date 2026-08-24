import Link from "next/link";

const links = [
  { href: "/landing/home", label: "Home" },
  { href: "/landing/features", label: "Features" },
  { href: "/landing/flow", label: "Flow" },
  { href: "/landing/role", label: "Roles" },
  { href: "/landing/get_started", label: "Get started" },
];

type LandingRouteNavProps = {
  current: string;
};

export default function LandingRouteNav({ current }: LandingRouteNavProps) {
  return (
    <nav className="w-full px-6 py-4">
      <div className="glass-panel flex flex-wrap items-center gap-2 rounded-2xl p-3">
        {links.map((link) => {
          const isActive = current === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                isActive
                  ? "border-amber-300/60 bg-amber-300/10 text-amber-200"
                  : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
