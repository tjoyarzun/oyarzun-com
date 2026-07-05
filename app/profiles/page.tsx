"use client";

import { motion } from "framer-motion";
import { profiles } from "@/lib/data";
import ProfileCard from "@/components/profiles/ProfileCard";
import SkillRadar from "@/components/profiles/SkillRadar";
import CareerTimeline from "@/components/profiles/CareerTimeline";
import GitHubHeatmap from "@/components/profiles/GitHubHeatmap";
import ProjectCard from "@/components/profiles/ProjectCard";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-base font-semibold text-navy dark:text-white mb-3">
      {children}
    </h3>
  );
}

export default function ProfilesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Page Hero */}
      <div className="bg-navy dark:bg-[#121110] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Professional Profiles
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Two data nerds building pipelines by day, exploring Utah trails by
            weekend. Here&apos;s what we&apos;ve been up to professionally.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* ── HIM ── */}
          <div className="space-y-8">
            <ProfileCard profile={profiles.him} color="teal" />

            <div>
              <SkillRadar skills={profiles.him.skills} color="#C8973E" />
            </div>

            <div>
              <CareerTimeline career={profiles.him.career} />
            </div>

            <div>
              <GitHubHeatmap username={profiles.him.github} />
            </div>

            <div>
              <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <SectionHeading>Featured Projects</SectionHeading>
                <div className="space-y-4">
                  {profiles.him.projects.map((project) => (
                    <ProjectCard
                      key={project.title}
                      project={project}
                      color="teal"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── HER ── */}
          <div className="space-y-8">
            <ProfileCard profile={profiles.her} color="orange" />

            <div>
              <SkillRadar skills={profiles.her.skills} color="#D4614A" />
            </div>

            <div>
              <CareerTimeline career={profiles.her.career} />
            </div>

            <div>
              <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <SectionHeading>Featured Projects</SectionHeading>
                <div className="space-y-4">
                  {profiles.her.projects.map((project) => (
                    <ProjectCard
                      key={project.title}
                      project={project}
                      color="orange"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
