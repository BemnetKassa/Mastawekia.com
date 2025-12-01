import { useEffect, useState } from "react";
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

      {/* HERO SECTION */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>

        <Container className="relative py-20 text-center text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            Find Your Dream Job in Ethiopia
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            Browse verified job listings and discover top companies hiring today.
          </p>

          {/* Search Box */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, roles, locations..."
              className="w-full max-w-xl px-4 py-3 rounded-xl shadow-lg border border-white/30 bg-white/20 backdrop-blur text-white placeholder-white"
            />
            <Button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md">
              Search
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 text-blue-200 text-sm flex justify-center gap-4">
            <span className="cursor-pointer hover:text-white">Frontend</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white">Backend</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white">Remote</span>
          </div>
        </Container>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <Container className="py-16">
          
          {/* Featured Jobs */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Featured Jobs
            </h2>

            {loading ? (
              <div className="text-center text-gray-500">Loading jobs...</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-600">No jobs found.</div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(0, 6).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={() =>
                      api
                        .post(`/jobs/${job.id}/apply`)
                        .then(() => alert("Applied"))
                        .catch((err) =>
                          alert(
                            err?.response?.data?.message || "Could not apply"
                          )
                        )
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Featured Companies */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Featured Companies
            </h2>

            {companies.length === 0 ? (
              <div className="text-gray-600">No companies yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {companies.slice(0, 8).map((c) => (
                  <div key={c.id} className="bg-white rounded-xl shadow-lg border p-5 hover:shadow-xl transition">
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.location || "Location N/A"}</p>
                    <p className="text-sm text-gray-700 mt-3">
                      {c.description?.slice(0, 100)}...
                    </p>
                    <div className="mt-4">
                      <a
                        href={c.website || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit site →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* How it Works */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow text-center">
                <div className="text-4xl">🔎</div>
                <h4 className="font-semibold mt-3">Search Jobs</h4>
                <p className="text-gray-600 mt-1">Browse by role, company, or location.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow text-center">
                <div className="text-4xl">📝</div>
                <h4 className="font-semibold mt-3">Apply Easily</h4>
                <p className="text-gray-600 mt-1">Submit applications in one click.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow text-center">
                <div className="text-4xl">🏆</div>
                <h4 className="font-semibold mt-3">Get Hired</h4>
                <p className="text-gray-600 mt-1">Start your new career journey.</p>
              </div>
            </div>
          </section>

        </Container>
      </main>
    </div>
  );
}
