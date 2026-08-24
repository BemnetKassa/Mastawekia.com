const features = [
  {
    title: "Smart curation",
    body: "Every listing is reviewed for clarity and compensation transparency.",
  },
  {
    title: "Role readiness",
    body: "Candidates get prep briefs so interviews feel focused and fair.",
  },
  {
    title: "Signal over noise",
    body: "Clients receive shortlists instead of endless application piles.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-3">
        {features.map((item, index) => (
          <div
            key={item.title}
            className="fade-up rounded-3xl border border-white/10 bg-white/5 p-6"
            style={{ animationDelay: `${0.05 + index * 0.08}s` }}
          >
            <h3 className="font-display text-xl text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
