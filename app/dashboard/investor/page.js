"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InvestorDashboard() {
  const [stats, setStats] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard?role=investor")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("/api/startups/recommended")
      .then((res) => res.json())
      .then((data) => setRecommended(data.startups));
  }, []);

  // if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Investor Dashboard</h1>
        <Link href="/invest/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          New Investment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Investments</h2>
          <p className="text-2xl font-bold text-green-600">${stats.totalInvestments}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Portfolio Companies</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.portfolioCount}</p>
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Startups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.map((startup, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-bold">{startup.name}</h3>
              <p className="text-gray-600">{startup.sector} – Raising ${startup.target}</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
