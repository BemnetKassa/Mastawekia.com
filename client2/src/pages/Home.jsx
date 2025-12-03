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
    <div className="max-w-7xl mx-auto py-12 px-6">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Welcome to Mastawekia
        </h1>
        <p className="text-gray-700 text-lg">
          Your ultimate portal for jobs, news, and career opportunities.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Latest Jobs</h2>
          <p className="text-gray-600">Browse the newest job opportunities posted by top companies.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Company News</h2>
          <p className="text-gray-600">Stay up-to-date with the latest company and industry news.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-2">Post Opportunities</h2>
          <p className="text-gray-600">Employers can post jobs or news to reach top talent quickly.</p>
        </div>
      </section>
    </div>
  );
}



