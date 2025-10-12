import { redirect } from "next/navigation";

export default function CompanyDashboardRedirect() {
  // Redirect founders to the existing founder dashboard route
  redirect("/dashboard/founder");
}
