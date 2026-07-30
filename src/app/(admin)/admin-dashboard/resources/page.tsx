import { redirect } from "next/navigation";

export default function LegacyResourcesPage() {
  redirect("/admin-dashboard/membership/members-resources");
}
