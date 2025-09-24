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
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-600">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="mt-2 text-sm text-gray-500">Role: {user.role}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "overview" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "jobs" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          My Jobs
        </button>
        {user.role === "Employer" && (
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "posts" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            My Posts
          </button>
        )}
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "settings" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === "overview" && (
          <p className="text-gray-700">
            Welcome back, {user.name}! Here you can manage your account and view your activity.
          </p>
        )}

        {activeTab === "jobs" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Applied Jobs</h3>
            <p className="text-gray-600">No jobs applied yet.</p>
          </div>
        )}

        {activeTab === "posts" && user.role === "Employer" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">My Job Posts</h3>
            <p className="text-gray-600">No posts created yet.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
