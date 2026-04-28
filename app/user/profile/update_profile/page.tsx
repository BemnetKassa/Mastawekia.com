'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "../../../../features/profile/createProfile";
import { getProfile } from "../../../../features/profile/getProfile";
import { getUserRole } from "@/lib/auth";
import router from "next/dist/shared/lib/router/router";
import { profile } from "console";

export default function UpdateProfilePage() {
  const router = useRouter();

  const [Loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

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

    // Fetch existing profile data to pre-fill the form
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (!profile) {
          alert("No profile found. Please create a profile first.");
          return;
        }
        setBio(profile.bio || "");
        setSkills(profile.skills ? profile.skills.join(", ") : "");

      } catch (error: any) {
        console.error("Failed to load profile:", error);
        alert("Failed to load profile. Please try again.");

        if (error.message === "Unauthorized") {
          alert("Session expired. Please login again.");
          router.push("/auth/login");
        }
      }

    }
  }, [router]);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createProfile({
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
      });
      alert("Profile created successfully!");
      router.push("/user/profile");
    } catch (error) {
      console.error("Failed to create profile:", error);
      setErrorMessage("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        onClick={() => handleSubmit()}
        disabled={Loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
      >
        {Loading ? "Creating..." : "Create Profile"}
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}