"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FounderDashboard() {
  const [stats, setStats] = useState(null);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard?role=founder")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("/api/investors/interested")
      .then((res) => res.json())
      .then((data) => setInvestors(data.investors));
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Founder Dashboard</h1>
        <Link href="/raise/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Create Raise
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Funds Raised</h2>
          <p className="text-2xl font-bold text-green-600">${stats.raised}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Active Investors</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.investors}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Pending Pitches</h2>
          <p className="text-2xl font-bold text-yellow-600">{stats.pitches}</p>
        </div>
      </div>

      {/* Interested Investors */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Interested Investors</h2>
        <ul className="space-y-3">
          {investors.map((inv, i) => (
            <li key={i} className="bg-white shadow rounded-lg p-4 flex justify-between">
              <div>
                <h3 className="font-bold">{inv.name}</h3>
                <p className="text-gray-600">{inv.focusArea}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Contact
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
