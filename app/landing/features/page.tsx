import LandingRouteNav from "../LandingRouteNav";
import FeaturesSection from "./FeaturesSection";

const detailFeatures = [
  {
    title: "Structured job templates",
    body: "Guide clients to publish complete, readable job posts with responsibilities, outcomes, and compensation ranges.",
  },
  {
    title: "Application status tracking",
    body: "Candidates can follow every stage, from submitted to shortlisted, with less uncertainty.",
  },
  {
    title: "Role-fit summaries",
    body: "Clients get concise application summaries that highlight experience, portfolio quality, and availability.",
  },
  {
    title: "Dashboard workflows",
    body: "Both sides have focused dashboards for actions they actually need today.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/features" />
      <FeaturesSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {detailFeatures.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="font-display text-2xl text-white">{feature.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-6 py-8">
        <div className="glass-panel rounded-3xl p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Outcome</p>
          <h2 className="mt-3 font-display text-3xl text-white">Built for quality over volume</h2>
          <p className="mt-4 max-w-3xl text-sm text-slate-300">
            Mastawekia prioritizes high-intent hiring interactions. Instead of overwhelming teams
            with low-context applications, the platform helps present stronger candidate narratives
            and clearer hiring expectations.
          </p>
        </div>
      </section>
    </main>
  );
}
