export default function Jobs() {
  // later: fetch jobs from backend with axios
  const jobs = [
    { id: 1, title: "Software Engineer", company: "Tech Ethiopia", location: "Addis Ababa" },
    { id: 2, title: "Marketing Manager", company: "Coffee Corp", location: "Adama" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Latest Job Openings</h1>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company} — {job.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
