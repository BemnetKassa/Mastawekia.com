import { useState } from "react";

export default function PostJob() {
  const [formData, setFormData] = useState({ title: "", company: "", location: "", description: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log("Job Posted:", formData); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Post a New Job</h2>
        {["title","company","location"].map(field => (
          <div key={field}>
            <label className="block font-medium text-gray-700 capitalize">{field}</label>
            <input type="text" name={field} value={formData[field]} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300" required />
          </div>
        ))}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Post Job</button>
      </form>
    </div>
  );
}
