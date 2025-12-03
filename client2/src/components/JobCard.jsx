import Button from "./Button";

export default function JobCard({ job, onApply }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.location || "Remote"} • {job.salary || "Salary N/A"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-700">{job.description?.slice(0, 200)}{job.description?.length > 200 ? "…" : ""}</p>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => onApply?.(job.id)}>Apply</Button>
      </div>
    </div>
  );
}