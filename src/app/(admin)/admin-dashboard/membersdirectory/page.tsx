import { redirect } from "next/navigation";

export default function LegacyMembersDirectoryPage() {
  redirect("/admin-dashboard/membership/directory");
}
