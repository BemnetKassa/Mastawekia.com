'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function myApplications() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
    </div>

  );
}
