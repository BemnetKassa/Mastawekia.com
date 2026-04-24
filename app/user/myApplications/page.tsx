'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { getMyApplications } from "../../../features/apply/getMyApplications"


export default function myApplications() {
  
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);

  const normalizeApplications = (data: any) => {
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }
  useEffect(() => {
    getMyApplications()
      .then((data) => {
        setApplications(normalizeApplications(data));

      })
      .catch(() => {
        alert("Failed to load applications.");
      });
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login as a user to access the user dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role !== "USER") {
      alert("Unauthorized access. Please login with a user account.");
      router.push("/auth/login");
      return;
    }

  }, [router]);
  ;

  return (
    <div className="min-h-screen px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <section>
        {applications.length === 0 ? (<p> You have not applied to any jobs yet.</p>) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li key={app.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{app.job?.title || "Untitled Job"}</h2>
                <p className="text-sm text-gray-600">Status: {app.status || "Unknown"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>


    </div>

  );
}
