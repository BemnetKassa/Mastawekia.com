import { useEffect, useState } from "react";
// changed code: import components from the components index
import { Container, JobCard, Button } from "../components";
import api from "../api/axios";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          api.get("/jobs").then((r) => r.data).catch(() => []),
          api.get("/companies").then((r) => r.data).catch(() => []),
        ]);
        if (!mounted) return;
        setJobs(Array.isArray(jobsRes) ? jobsRes : jobsRes?.data ?? []);
        setCompanies(Array.isArray(companiesRes) ? companiesRes : companiesRes?.data ?? []);
      } catch (err) {
        console.error("Home load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = jobs.filter((j) =>
    (j.title || "").toLowerCase().includes(query.toLowerCase()) ||
    (j.location || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Container className="py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-blue-600">Find great jobs in Ethiopia</h1>
            <p className="mt-3 text-gray-600">
              Browse openings from trusted companies and stay updated with the latest company news.
            </p>

            <div className="mt-6 flex gap-3 items-center justify-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs or locations (e.g. Addis Ababa, Remote)"
                className="w-full max-w-xl border rounded-lg px-4 py-2 shadow-sm"
              />
              <Button onClick={() => {}} className="px-6">Search</Button>
            </div>

            <div className="mt-4 flex justify-center gap-3 text-sm text-gray-500">
              <span>Quick: <strong>Frontend</strong></span>
              <span>•</span>
              <span><strong>Marketing</strong></span>
              <span>•</span>
              <span><strong>Remote</strong></span>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <Container className="py-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Featured Jobs</h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading jobs...</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-600">No jobs found.</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {filtered.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} onApply={() => {
                    api.post(`/jobs/${job.id}/apply`).then(() => alert("Applied")).catch((err) => alert(err?.response?.data?.message || "Could not apply"));
                  }} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Featured Companies</h2>
            {companies.length === 0 ? (
              <div className="text-gray-600">No companies yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {companies.slice(0, 6).map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{c.location || "Location N/A"}</p>
                    <p className="text-sm text-gray-700 mt-3">{c.description?.slice(0, 120)}</p>
                    <div className="mt-4">
                      <a href={c.website || "#"} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Visit</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-3xl">🔎</div>
                <h4 className="font-semibold mt-2">Search</h4>
                <p className="text-sm text-gray-600 mt-1">Find jobs by title, company or location.</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-3xl">📝</div>
                <h4 className="font-semibold mt-2">Apply</h4>
                <p className="text-sm text-gray-600 mt-1">Apply with one click or visit company pages.</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-3xl">🏆</div>
                <h4 className="font-semibold mt-2">Get Hired</h4>
                <p className="text-sm text-gray-600 mt-1">Connect with employers and land your next role.</p>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
