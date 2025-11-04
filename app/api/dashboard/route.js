"use client"

// app/api/dashboard/route.js
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  if (role === "fundmanager") {
    redirect("fundManagerDashboard")
  }

  if (role === "investor") {
    redirect("dashboard/investor")
  }

  if (role === "founder") {
    redirect("dashboard/founder")
  }

  return NextResponse.json({ error: "Role not recognized" }, { status: 400 });
}
