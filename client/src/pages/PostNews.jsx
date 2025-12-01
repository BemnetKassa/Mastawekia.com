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
      <div className="card w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Post Company News
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input name="title" required className="w-full mt-1" onChange={handleChange} />
          </div>

          <div>
            <label>Content</label>
            <textarea name="content" rows="6" required className="w-full mt-1" onChange={handleChange} />
          </div>

          <button className="btn-primary w-full bg-green-600 hover:bg-green-700">Post News</button>
        </form>
      </div>
    </div>
  );

}
