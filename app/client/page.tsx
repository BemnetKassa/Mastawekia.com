'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function ClientPage() {
  const router = useRouter();

  useEffect(() => {

  })

  return (
    <div>
      <Link href="/client/createJob" className="min-h-screen px-6 py-12">
        CreateJob
      </Link>
      <Link href="/client/applications" className="min-h-screen px-6 py-12">
        applicants
      </Link>
    </div>
  )
}
