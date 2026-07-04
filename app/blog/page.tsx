import { getAllPosts } from "@/lib/posts";
import BlogClientPage from "@/components/blog/BlogClientPage";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClientPage posts={posts} />;
}
