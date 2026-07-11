import { getAllPosts } from "@/lib/posts";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  const postCount = getAllPosts().filter((p) => !p.draft).length;
  return <DashboardClient postCount={postCount} />;
}
