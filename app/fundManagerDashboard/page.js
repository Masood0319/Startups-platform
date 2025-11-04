"use client";

import { useEffect, useState } from "react";

export default function FundManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [funds, setFunds] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [fundsRes, portfolioRes] = await Promise.all([
          fetch("/api/funds?mine=true", { cache: "no-store" }),
          fetch("/api/funds/portfolio", { cache: "no-store" }),
        ]);
        const fundsData = await fundsRes.json();
        const portfolioData = await portfolioRes.json();
        if (!fundsRes.ok) throw new Error(fundsData?.error || "Failed to load funds");
        if (!portfolioRes.ok) throw new Error(portfolioData?.error || "Failed to load portfolio");
        setFunds(Array.isArray(fundsData) ? fundsData : fundsData.funds || []);
        setPortfolio(portfolioData.startups || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fund Manager Dashboard</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Funds you created */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">Your Funds</h2>
          <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">Create Fund</button>
        </div>
        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {funds.map((f) => (
              <div key={f._id} className="rounded-lg border border-white/10 bg-black/20 p-4 hover:bg-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{f.name || "Untitled Fund"}</h3>
                  {f.logo && <img src={f.logo} alt={f.name} className="h-10 w-10 rounded object-cover border border-white/10" />}
                </div>
                <p className="mt-2 text-sm text-gray-300">{f.thesis || f.description || "No thesis provided."}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div><span className="opacity-70">AUM:</span> ${f.aum || "N/A"}</div>
                  <div><span className="opacity-70">Stage:</span> {f.stage || "N/A"}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">Manage</button>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20">View</button>
                </div>
              </div>
            ))}
            {funds.length === 0 && <p className="text-gray-400">You havent created any funds yet.</p>}
          </div>
        )}
      </section>

      {/* Portfolio companies */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Portfolio Companies</h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="p-3">Startup</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Investment</th>
                <th className="p-3">Stage</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((s, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.sector}</td>
                  <td className="p-3">${s.investment}</td>
                  <td className="p-3">{s.stage}</td>
                </tr>
              ))}
              {portfolio.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-400" colSpan={4}>No portfolio companies yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
