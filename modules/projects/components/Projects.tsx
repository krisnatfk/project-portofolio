"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import ProjectSkeleton from "./ProjectSkeleton";
import ProjectCard from "./ProjectCard";

import EmptyState from "@/common/components/elements/EmptyState";
import { fetcher } from "@/services/fetcher";
import { ProjectItem } from "@/common/types/projects";

const Projects = () => {
  const { data, isLoading, error } = useSWR("/api/projects", fetcher);

  const t = useTranslations("ProjectsPage");

  // API already returns repos sorted by UPDATED_AT DESC (newest first)
  const projects: ProjectItem[] = data?.filter(
    (item: ProjectItem) => item?.is_show,
  ) ?? [];

  if (error) {
    return <EmptyState message={t("error")} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyState message={t("no_data")} />;
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProjectCard {...project} />
        </motion.div>
      ))}
    </section>
  );
};

export default Projects;
