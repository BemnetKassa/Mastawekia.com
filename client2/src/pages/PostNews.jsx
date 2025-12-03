import { useState } from "react";

export default function PostNews() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log("News Posted:", formData); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-4">Post Company News</h2>
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300" required />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="6" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300" required />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Post News</button>
      </form>
    </div>
  );
}
