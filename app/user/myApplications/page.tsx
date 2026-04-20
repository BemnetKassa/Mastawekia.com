'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";


export default function MyApplicationsPage() {
  const router = useRouter();

  // Dummy data for demonstration; replace with real data fetching logic
  type Application = {
    id: string;
    job: { title: string };
    status: string;
  };

  const applications: Application[] = [
    { id: "1", job: { title: "Frontend Developer" }, status: "Pending" },
    { id: "2", job: { title: "Backend Developer" }, status: "Accepted" },
  ];

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

  return (
    <>
      <h1>My Applications</h1>
      {applications.map((app) => (
        <div key={app.id}>
          <p>{app.job.title}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </>
  );
}