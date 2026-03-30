'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApplications } from "../../features/apply/getApplications";



export default function ApplicationsPage() {

  const [applications, setApplications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    getApplications().then(setApplications);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {applications.length === 0 && <p>No applications yet</p>}

      {applications.map((app: any) => (
        <div key={app.id} className="border p-4 mb-3">
          <p><strong>Job:</strong> {app.job.title}</p>
          <p><strong>Applicant:</strong> {app.user.email}</p>
        </div>
      ))}
    </div>
  );

}
