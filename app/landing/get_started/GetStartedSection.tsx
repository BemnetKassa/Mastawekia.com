export default function GetStartedSection() {
  return (
    <section id="cta" className="w-full px-6 pb-20 pt-12">
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/30 bg-linear-to-r from-amber-400/15 via-transparent to-slate-900/40 p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl text-white">Ready to ship your next role?</h2>
            <p className="mt-3 text-sm text-slate-300">
              Create an account in minutes and publish a job post that reaches high-intent
              candidates immediately.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <a
              href="/auth/register"
              className="rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Get started
            </a>
            <a
              href="/user/jobListing"
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
            >
              Browse jobs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
