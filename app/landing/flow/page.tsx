import LandingRouteNav from "../LandingRouteNav";
import FlowSection from "./FlowSection";

const candidateFlow = [
  "Create profile with portfolio and role preferences",
  "Browse curated listings and submit applications",
  "Track review status and interview updates",
  "Receive decision feedback and next steps",
];

const clientFlow = [
  "Create company profile and define hiring goals",
  "Publish role details with clear outcomes",
  "Review applications with shortlist support",
  "Coordinate interviews and close offers",
];

export default function FlowPage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/flow" />
      <FlowSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Candidate journey</p>
            <h2 className="mt-3 font-display text-2xl text-white">From discovery to decision</h2>
            <ol className="mt-5 space-y-3 text-sm text-slate-300">
              {candidateFlow.map((step, index) => (
                <li key={step} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Client journey</p>
            <h2 className="mt-3 font-display text-2xl text-white">From posting to placement</h2>
            <ol className="mt-5 space-y-3 text-sm text-slate-300">
              {clientFlow.map((step, index) => (
                <li key={step} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
