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

  const filteredProjects: ProjectItem[] = data
    ?.filter((item: ProjectItem) => item?.is_show)
    .sort((a: ProjectItem, b: ProjectItem) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;

      if (a.is_featured && b.is_featured) return a.id - b.id;

      return b.id - a.id;
    });

  if (filteredProjects?.length === 0) {
    return <EmptyState message={t("no_data")} />;
  }

  if (error) {
    return <EmptyState message={t("error")} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {filteredProjects?.map((project, index) => (
        <motion.div
          key={index}
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
