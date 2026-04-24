'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";


export default function myApplications() {
  const router = useRouter();

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
    <div>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
    </div>

  );
}
