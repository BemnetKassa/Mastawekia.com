const steps = [
  "Create a profile",
  "Publish or apply",
  "Review shortlist",
  "Schedule interviews",
];

export default function FlowSection() {
  return (
    <section id="flow" className="w-full px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">How it works</p>
          <h2 className="font-display text-3xl text-white">Designed for momentum</h2>
          <p className="text-sm text-slate-300">
            Whether you are hiring or job hunting, every step nudges you to the next
            conversation. No waiting for weeks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step} className="glass-panel rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Step {index + 1}</p>
              <p className="mt-3 text-sm text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
