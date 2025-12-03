export default function News() {
  const newsPosts = [
    { id: 1, title: "New Internship Program Launched", company: "Tech Ethiopia", content: "Excited to announce our 6-month internship for graduates.", date: "Sep 10, 2025" },
    { id: 2, title: "Coffee Corp Expands to Adama", company: "Coffee Corp", content: "Opened a new branch in Adama to serve more customers.", date: "Sep 8, 2025" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Company News</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsPosts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm">{post.company} • {post.date}</p>
            <p className="text-gray-700 mt-3">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
