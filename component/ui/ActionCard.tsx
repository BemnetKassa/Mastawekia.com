import Link from "next/link";

type ActionCardProps = {
  href: string;
  title: string;
  description: string;
  cta: string;
};

export default function ActionCard({
  href,
  title,
  description,
  cta,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:-translate-y-0.5 hover:border-amber-300/40"
    >
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-amber-200">
          {title}
        </p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-amber-200">
        {cta}
      </span>
    </Link>
  );
}
