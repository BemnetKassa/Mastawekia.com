'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    // Your effect logic here
  }, [router]);


  return (
    <div>
      <Link href="/user/jobListing" className="min-h-screen px-6 py-12">
        JobListing
      </Link>
    </div>
  );
}