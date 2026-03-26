"use client";

import { useEffect, useState } from "react";
import { getJobs } from "../../features/jobListing/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      {jobs.map((job: any) => (
        <div key={job.id} className="border p-4 mb-3">
          <h2 className="font-semibold">{job.title}</h2>
          <p>{job.company}</p>
        </div>
      ))}
    </div>
  );
}