export default function News() {
  // Later: fetch news from backend with axios
  const newsPosts = [
    {
      id: 1,
      title: "New Internship Program Launched",
      company: "Tech Ethiopia",
      content: "We are excited to announce our new 6-month internship program for fresh graduates.",
      date: "Sep 10, 2025",
    },
    {
      id: 2,
      title: "Coffee Corp Expands to Adama",
      company: "Coffee Corp",
      content: "Coffee Corp has officially opened a new branch in Adama to serve more customers.",
      date: "Sep 8, 2025",
    },
  ];

    return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Company News</h1>

      <div className="space-y-6">
        {newsPosts.map((post) => (
          <div key={post.id} className="card">
            <h2 className="text-xl font-semibold text-secondary">{post.title}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {post.company} • {post.date}
            </p>
            <p className="mt-3 text-gray-700">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

}
