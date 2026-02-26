"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { TbPinnedFilled as PinIcon } from "react-icons/tb";
import { BsGithub as GithubIcon } from "react-icons/bs";
import { HiOutlineExternalLink as DemoIcon } from "react-icons/hi";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { ProjectItem } from "@/common/types/projects";
import { STACKS } from "@/common/constants/stacks";

const ProjectCard = ({
  title,
  slug,
  description,
  image,
  stacks,
  is_featured,
  link_github,
  link_demo,
}: ProjectItem) => {
  const t = useTranslations("ProjectsPage");

  const trimmedContent =
    description.slice(0, 100) + (description.length > 100 ? "..." : "");

  return (
    <SpotlightCard className="group relative flex h-full flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800">
      {/* Featured Badge */}
      {is_featured && (
        <div className="absolute right-0 top-0 z-10 flex items-center gap-x-1 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-xs font-semibold text-neutral-900">
          <PinIcon size={12} />
          <span>Featured</span>
        </div>
      )}

      {/* Image */}
      <Link href={`/projects/${slug}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={450}
            height={200}
            className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/70 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>{t("view_project")}</span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1.5">
          <Link href={`/projects/${slug}`}>
            <h3 className="font-semibold text-neutral-800 transition-colors duration-300 group-hover:text-primary dark:text-neutral-200">
              {title}
            </h3>
          </Link>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {trimmedContent}
          </p>
        </div>

        {/* Bottom: Stacks + Links */}
        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {/* Tech Stacks */}
          <div className="flex flex-wrap items-center gap-2">
            {stacks.length > 0
              ? stacks.slice(0, 4).map((stack: string, index: number) => {
                const stackData = STACKS[stack];
                if (!stackData) return null;
                return (
                  <div key={index} title={stack} className={`${stackData.color}`}>
                    {stackData.icon}
                  </div>
                );
              })
              : (
                <span className="text-[11px] text-neutral-400">No stack info</span>
              )}
            {stacks.length > 4 && (
              <span className="text-[11px] text-neutral-400">+{stacks.length - 4}</span>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {link_github && (
              <Link
                href={link_github}
                target="_blank"
                rel="noopener noreferrer"
                title="Source Code"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full p-1.5 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <GithubIcon size={16} />
              </Link>
            )}
            {link_demo && (
              <Link
                href={link_demo}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full p-1.5 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <DemoIcon size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ProjectCard;
