const roles = [
  "Product Design",
  "Frontend Engineering",
  "Marketing",
  "Operations",
  "Data",
  "Customer Success",
];

export default function RoleSection() {
  return (
    <section id="roles" className="w-full px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl text-white">Roles you will find here</h2>
            <p className="mt-3 text-sm text-slate-300">
              Product, growth, design, engineering, and operations roles from teams building
              the next wave of African tech.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
