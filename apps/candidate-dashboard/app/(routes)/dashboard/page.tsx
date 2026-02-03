import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Dashboard has been removed. Keep this route as a compatibility redirect.
  redirect("/mockinterview");
}
