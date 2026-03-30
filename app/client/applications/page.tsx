"use client";

import { useEffect, useState } from "react";
import { getApplications } from "../../../features/apply/getApplications";
import { useRouter } from "next/navigation";

type Application = {
  id: string | number;
  job?: { title?: string };
  user?: { email?: string };
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    getApplications()
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setApplications(normalized);
      })
      .catch(() => {
        setApplications([]);
        alert("Failed to load applications.");
      });
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {applications.length === 0 && <p>No applications yet</p>}

      {applications.map((app) => (
        <div key={String(app.id)} className="border p-4 mb-3">
          <p><strong>Job:</strong> {app.job?.title || "N/A"}</p>
          <p><strong>Applicant:</strong> {app.user?.email || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}