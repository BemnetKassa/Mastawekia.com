'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "../../../../features/profile/createProfile";
import { getProfile } from "../../../../features/profile/getProfile";
import { getUserRole } from "@/lib/auth";

export default function UpdateProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

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
        const profile = res?.profile || res;

        if (profile) {
          setBio(profile.bio || "");
          setSkills(profile.skills?.join(", ") || "");
        }
      } catch (error: any) {
        console.error(error);
        setErrorMessage("Failed to load profile.");

        if (error?.message === "Unauthorized") {
          router.push("/auth/login");
        }
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await createProfile({
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });

      alert("Profile saved successfully!");
      router.push("/user/profile");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create / Update Profile</h1>

      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}

      <div>
        <label className="block mb-1 font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Skills (comma separated)
        </label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}