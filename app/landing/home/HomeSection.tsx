export default function HomeSection() {
  return (
    <>
      <header className="flex w-full items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-900">
            <span className="font-display text-lg">M</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Mastawekia</p>
            <p className="text-sm text-slate-300">Talent Studio</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#flow">Flow</a>
          <a className="hover:text-white" href="#roles">Roles</a>
          <a className="hover:text-white" href="#cta">Get started</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/auth/login"
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
          >
            Login
          </a>
          <a
            href="/auth/register"
            className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Register
          </a>
        </div>
      </header>

      <section className="grid w-full items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span
            className="fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200"
            style={{ animationDelay: "0.05s" }}
          >
            New roles daily
          </span>
          <h1 className="fade-up font-display text-4xl text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
            A job board that feels like a creative studio.
          </h1>
          <p className="fade-up max-w-xl text-sm text-slate-300 sm:text-base" style={{ animationDelay: "0.15s" }}>
            Mastawekia connects clients with ambitious talent through curated listings,
            verified companies, and smart matching. Build a profile, publish a role, and
            move fast.
          </p>
          <div className="fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.2s" }}>
            <a
              href="/user/jobListing"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              Explore jobs
            </a>
            <a
              href="/auth/register"
              className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
            >
              Post a job
            </a>
          </div>
          <div className="fade-up flex flex-wrap gap-6 text-xs text-slate-400" style={{ animationDelay: "0.25s" }}>
            <span className="rounded-full border border-white/10 px-4 py-2">Shortlist in hours</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Curated talent pool</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Verified clients</span>
          </div>
        </div>
        <div className="relative fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -top-10 right-8 h-28 w-28 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="glass-panel accent-ring rounded-3xl p-6">
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Featured</p>
                <h2 className="font-display text-xl text-white">Senior Product Designer</h2>
                <p className="text-sm text-slate-300">Atlas Studio - Remote</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Just added</p>
                <h2 className="font-display text-xl text-white">Growth Marketing Lead</h2>
                <p className="text-sm text-slate-300">Nova Lab - Nairobi</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Client call</p>
                <h2 className="font-display text-xl text-white">Product Manager</h2>
                <p className="text-sm text-slate-300">Pulse Systems - Hybrid</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
