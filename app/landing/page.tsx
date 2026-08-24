
import Link from "next/link";
import LandingRouteNav from "./LandingRouteNav";
import HomeSection from "./home/HomeSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/home" />
      <HomeSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/landing/features" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Explore</p>
            <h2 className="mt-3 font-display text-xl text-white">Features</h2>
            <p className="mt-2 text-sm text-slate-300">See platform capabilities in more depth.</p>
          </Link>
          <Link href="/landing/flow" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Explore</p>
            <h2 className="mt-3 font-display text-xl text-white">Flow</h2>
            <p className="mt-2 text-sm text-slate-300">Understand the end-to-end hiring journey.</p>
          </Link>
          <Link href="/landing/role" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Explore</p>
            <h2 className="mt-3 font-display text-xl text-white">Roles</h2>
            <p className="mt-2 text-sm text-slate-300">Browse role categories and examples.</p>
          </Link>
          <Link href="/landing/get_started" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Explore</p>
            <h2 className="mt-3 font-display text-xl text-white">Get started</h2>
            <p className="mt-2 text-sm text-slate-300">Follow the onboarding and first-action steps.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}