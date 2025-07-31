/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { getCurrentUser} from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/";
import { useEffect, useState } from "react";

export default function DashboardHome() {
    const router = useRouter();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard 👋</h2>
      <p>Select an item from the sidebar to begin.</p>
    </div>
  );
}
