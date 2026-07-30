import { redirect } from "next/navigation";

export default function LegacyConferenceSchedulePage() {
  redirect("/admin-dashboard/conferences/conference-schedule");
}
