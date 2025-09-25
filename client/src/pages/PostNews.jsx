import { useState } from "react";

export default function PostNews() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New news posted:", formData);
    // Later: api.post("/news", formData)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Post Company News
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* News Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* News Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Post News
          </button>
        </form>
      </div>
    </div>
  );
}
