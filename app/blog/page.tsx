import { getAllPosts } from "@/lib/posts";
import BlogClientPage from "@/components/blog/BlogClientPage";

export default function BlogPage() {
  // getAllPosts() returns drafts too, so without this filter the first post
  // marked `draft: true` would publish itself to the index.
  const posts = getAllPosts().filter((p) => !p.draft);
  return <BlogClientPage posts={posts} />;
}
