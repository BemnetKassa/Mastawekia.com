import { useEffect, useState, useContext } from "react";
import { Container, JobCard, Button } from "../components";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Jobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const loadJobs = async ({ reset = false } = {}) => {
    setLoading(true);
    try {
      const params = {
        q: query || undefined,
        sort: sort || undefined,
        page: reset ? 1 : page,
        limit: pageSize,
      };
      const res = await api.get("/jobs", { params });
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setJobs((prev) => (reset ? data : [...prev, ...data]));
      setPage(reset ? 2 : page + 1);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs({ reset: true });
  }, [query, sort]);

  const handleApply = async (jobId) => {
    if (!user) return alert("Please log in to apply.");
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert("Application submitted.");
    } catch (err) {
      alert(err?.response?.data?.message || "Could not apply.");
    }
  };

  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Job Openings</h1>
          <p className="text-gray-600 mt-1">{jobs.length} results</p>
        </div>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company or location"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="text-center text-gray-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-gray-600">No jobs found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => loadJobs({ reset: false })}
          className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load more"}
        </Button>
      </div>
    </Container>
  );
}
