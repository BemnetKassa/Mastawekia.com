'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "../../../../features/profile/createProfile";
import { getProfile } from "../../../../features/profile/getProfile";
import { getUserRole } from "@/lib/auth";

export default function CreateProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  })
}