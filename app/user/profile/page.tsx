'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { DashboardNavLink } from "@/component/shared/DashboardNav";

const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
];
const metrics = [
  { label: "Applications", value: "7", helper: "Submitted this month" },
  { label: "Saved roles", value: "5", helper: "Shortlist in progress" },
  { label: "Interviews", value: "2", helper: "Scheduled upcoming" },
];
export default function UserPage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before trying to access the user Profile.");
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



  useEffect(() => {

  })
}