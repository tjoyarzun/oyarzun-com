import HeroSection from "@/components/home/HeroSection";
import AboutUs from "@/components/home/AboutUs";
import ProfilesPreview from "@/components/home/ProfilesPreview";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import NavGrid from "@/components/home/NavGrid";
import BlogTeaser from "@/components/home/BlogTeaser";
import CurrentlyWidget from "@/components/home/CurrentlyWidget";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <AboutUs />

      <ProfilesPreview />

      <div className="bg-slate dark:bg-[#121110]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <NavGrid />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {/* Currently column */}
            <div>
              <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-6">
                Currently
              </h2>
              <div className="space-y-6">
                <MemoryOfDay />
                <CurrentlyWidget />
              </div>
            </div>

            {/* Blog column */}
            <BlogTeaser />
          </div>
        </div>
      </div>
    </>
  );
}
