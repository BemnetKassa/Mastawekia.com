"use client";

import { useState } from "react";
import { createJob } from "../lib/api";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    await createJob({ title, company, description });
    alert("Job created!");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
      <input placeholder="Company" onChange={(e) => setCompany(e.target.value)} className="border p-2 w-full mb-2" />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2" />

      <button onClick={handleSubmit} className="bg-black text-white p-2 w-full">
        Create Job
      </button>
    </div>
  );
}