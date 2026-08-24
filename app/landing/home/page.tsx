import LandingRouteNav from "../LandingRouteNav";
import HomeSection from "./HomeSection";

const highlights = [
  {
    title: "Verified hiring teams",
    body: "Each company profile is reviewed so candidates can trust who they are speaking with.",
  },
  {
    title: "Human-first matching",
    body: "Applications are organized by fit signals, not only keyword matching.",
  },
  {
    title: "Faster interview loops",
    body: "Built-in prompts help both candidates and clients arrive prepared to every call.",
  },
];

export default function LandingHomePage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/home" />
      <HomeSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="fade-up rounded-3xl border border-white/10 bg-white/5 p-6"
              style={{ animationDelay: `${0.05 + index * 0.08}s` }}
            >
              <h2 className="font-display text-2xl text-white">{item.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-6 py-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <h2 className="font-display text-3xl text-white">What makes Mastawekia different?</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">For candidates</p>
              <p className="mt-3 text-sm text-slate-300">
                Build one profile that can be used across multiple role types, from design to
                data, while keeping your story consistent.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">For clients</p>
              <p className="mt-3 text-sm text-slate-300">
                Launch clear, brand-ready listings with role goals, expected outcomes, and
                screening criteria to attract better-fit applicants.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
