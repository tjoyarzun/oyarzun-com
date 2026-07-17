import HeroSection from "@/components/home/HeroSection";
import FunMetrics from "@/components/home/FunMetrics";
import ProfilesPreview from "@/components/home/ProfilesPreview";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import NavGrid from "@/components/home/NavGrid";
import BlogTeaser from "@/components/home/BlogTeaser";
import CurrentlyWidget from "@/components/home/CurrentlyWidget";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const postCount = getAllPosts().filter((p) => !p.draft).length;

  return (
    <>
      <HeroSection />

      <FunMetrics postCount={postCount} />

      <ProfilesPreview />

      <div className="bg-slate dark:bg-[#121110]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-12">
              <NavGrid />

              <BlogTeaser />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <MemoryOfDay />
              <CurrentlyWidget />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
