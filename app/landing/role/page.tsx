import LandingRouteNav from "../LandingRouteNav";
import RoleSection from "./RoleSection";

const roleGroups = [
  {
    name: "Product & Design",
    items: ["Product Designer", "UI Designer", "Product Manager", "UX Researcher"],
  },
  {
    name: "Engineering & Data",
    items: ["Frontend Engineer", "Backend Engineer", "Data Analyst", "QA Engineer"],
  },
  {
    name: "Growth & Operations",
    items: ["Growth Lead", "Content Strategist", "Operations Manager", "Customer Success"],
  },
];

export default function RolePage() {
  return (
    <main className="min-h-screen pb-20">
      <LandingRouteNav current="/landing/role" />
      <RoleSection />

      <section className="w-full px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {roleGroups.map((group) => (
            <article key={group.name} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="font-display text-2xl text-white">{group.name}</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {group.items.map((item) => (
                  <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-6 py-8">
        <div className="glass-panel rounded-3xl p-8">
          <h2 className="font-display text-3xl text-white">Role quality standards</h2>
          <p className="mt-3 text-sm text-slate-300">
            Listings are encouraged to include role outcomes for the first 90 days, expected
            collaboration style, and growth opportunities. This helps candidates evaluate fit
            beyond titles.
          </p>
        </div>
      </section>
    </main>
  );
}
