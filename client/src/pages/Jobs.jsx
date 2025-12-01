import { useEffect, useState, useContext } from "react";
import { Container, JobCard, Button } from "../components";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Jobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest
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
      // assume backend returns an array; if payload differs adjust accordingly
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setJobs((prev) => (reset ? data : [...prev, ...data]));
      if (reset) setPage(2);
      else setPage((p) => p + 1);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load / reset when query or sort changes
    loadJobs({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Find Your Next Job</h1>
        <p className="text-gray-600 mt-1">{jobs.length} jobs available</p>
      </div>

      {/* Search & Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company or location"
            className="w-full"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full md:w-auto"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      {loading && jobs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      {/* Load More */}
      <div className="mt-10 flex justify-center">
        <Button
          onClick={() => loadJobs({ reset: false })}
          disabled={loading}
          className="btn-primary px-6 py-2"
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </Container>
  );

}
