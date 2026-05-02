'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { getProfile } from "../../../features/profile/getProfile";
import Link from "next/link";

export default function UserProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      router.push("/auth/login");
      return;
    }

    const role = getUserRole(token);

    if (role !== "USER") {
      alert("Unauthorized access.");
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        // normalize response shape
        const profile = res?.profile || res;

        setUserData(profile);
      } catch (error: any) {
        console.error(error);
        setErrorMessage("Failed to load profile.");

        if (error?.message === "Unauthorized") {
          router.push("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">

        <h1 className="text-2xl font-bold">User Profile</h1>

        {isLoading ? (
          <p>Loading profile...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : userData ? (
          <div className="space-y-3">
            <p><strong>Bio:</strong> {userData.bio}</p>
            <p><strong>Skills:</strong> {userData.skills?.join(", ")}</p>

            <Link
              href="/user/profile/update_profile"
              className="inline-block mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit Profile
            </Link>
          </div>
        ) : (
          <div>
            <p>No profile found.</p>
            <Link
              href="/user/profile/update_profile"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create Profile
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}