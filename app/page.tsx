import HeroSection from "@/components/home/HeroSection";
import ProfilesPreview from "@/components/home/ProfilesPreview";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import NavGrid from "@/components/home/NavGrid";
import BlogTeaser from "@/components/home/BlogTeaser";
import CurrentlyWidget from "@/components/home/CurrentlyWidget";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <ProfilesPreview />

      <div className="bg-slate dark:bg-[#121110]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <NavGrid />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Main column */}
            <div className="lg:col-span-2">
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
