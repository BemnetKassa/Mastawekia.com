import { useState } from "react";

export default function Profile() {
  const [user] = useState({ name: "Bemnet Kassa", email: "bemnet@example.com", role: "Job Seeker" });
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = ["overview","jobs","settings"];
  if(user.role === "Employer") tabs.splice(2,0,"posts");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold text-blue-600">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 mt-1">Role: {user.role}</p>
      </div>

      <div className="flex gap-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-medium ${activeTab===tab?"bg-blue-600 text-white":"bg-gray-200"}`}>
            {tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {activeTab==="overview" && <p>Welcome back, {user.name}! Manage your account here.</p>}
        {activeTab==="jobs" && <p>No jobs applied yet.</p>}
        {activeTab==="posts" && user.role==="Employer" && <p>No job posts yet.</p>}
        {activeTab==="settings" && <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>}
      </div>
    </div>
  );
}
