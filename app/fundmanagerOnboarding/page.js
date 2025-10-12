"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FundManagerOnboarding() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    fundName: "",
    fundSize: "",
    thesis: "",
    geography: "",
    minCheck: "",
    maxCheck: "",
    teamMembers: "",
    website: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      const payload = { ...formData };
      delete payload.logo;

      form.append(
        "payload",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (formData.logo) {
        form.append("logo", formData.logo);
      }

      const res = await fetch("/api/funds", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to submit onboarding");

      alert("✅ Fund onboarding completed!");
      router.push("fundManagerDashboard")
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Fund Manager Onboarding</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="fundName"
          placeholder="Fund/Company Name"
          value={formData.fundName}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="number"
          name="fundSize"
          placeholder="Fund Size (in PKR or USD)"
          value={formData.fundSize}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="thesis"
          placeholder="Investment Thesis / Focus Areas"
          value={formData.thesis}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          rows={3}
          required
        />

        <input
          type="text"
          name="geography"
          placeholder="Target Geography"
          value={formData.geography}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="minCheck"
            placeholder="Minimum Check Size"
            value={formData.minCheck}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <input
            type="number"
            name="maxCheck"
            placeholder="Maximum Check Size"
            value={formData.maxCheck}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <input
          type="text"
          name="teamMembers"
          placeholder="Team Members (optional)"
          value={formData.teamMembers}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="url"
          name="website"
          placeholder="Website / LinkedIn"
          value={formData.website}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <div>
          <label className="block mb-2">Upload Fund Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Onboarding
        </button>
      </form>
    </div>
  );
}
