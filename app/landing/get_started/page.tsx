import LandingRouteNav from "../LandingRouteNav";
import GetStartedSection from "./GetStartedSection";

const onboardingSteps = [
  {
    title: "Create your account",
    body: "Register as a user or client and set up your profile basics in under five minutes.",
  },
  {
    title: "Complete your profile",
    body: "Add experience, goals, and portfolio links to increase visibility and trust.",
  },
  {
    title: "Take your first action",
    body: "Apply for a role or publish a listing with clear responsibilities and outcomes.",
  },
  {
    title: "Track progress",
    body: "Follow updates in your dashboard and keep communication moving.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/get_started" />
      <GetStartedSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {onboardingSteps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Step {index + 1}</p>
              <h2 className="mt-3 font-display text-2xl text-white">{step.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-6 py-8">
        <div className="rounded-3xl border border-amber-300/30 bg-linear-to-r from-amber-400/15 via-transparent to-slate-900/40 p-8">
          <h2 className="font-display text-3xl text-white">Launch quickly, improve continuously</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Start with a clear profile and one focused action. The platform is designed to help
            you iterate fast, collect feedback, and improve your hiring or career outcomes over
            time.
          </p>
        </div>
      </section>
    </main>
  );
}
