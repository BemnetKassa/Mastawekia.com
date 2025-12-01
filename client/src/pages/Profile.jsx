import { useState } from "react";

export default function Profile() {
  // temporary mock user
  const [user] = useState({
    name: "Bemnet Kassa",
    email: "bemnet@example.com",
    role: "Job Seeker", // could also be "Employer"
  });

  const [activeTab, setActiveTab] = useState("overview");

  return (
  <div className="p-6">
    {/* User Info */}
    <div className="card mb-6">
      <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <p className="mt-2 text-sm text-gray-500">Role: {user.role}</p>
    </div>

    {/* Tabs */}
    <div className="flex gap-3 mb-6">
      {["overview", "jobs", "posts", "settings"].map((tab) =>
        (tab !== "posts" || user.role === "Employer") && (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab ? "bg-primary text-white" : "btn-secondary"
            }`}
          >
            {tab}
          </button>
        )
      )}
    </div>

    {/* Content */}
    <div className="card">
      {activeTab === "overview" && <p>Welcome back, {user.name}!</p>}
      {activeTab === "jobs" && <p>No jobs applied yet.</p>}
      {activeTab === "posts" && <p>No posts yet.</p>}
      {activeTab === "settings" && (
        <button className="btn-primary bg-red-600 hover:bg-red-700">Logout</button>
      )}
    </div>
  </div>
);

}
