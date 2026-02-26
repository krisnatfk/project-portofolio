import { GithubRepo } from "@/services/github";
import { buildStackList } from "@/common/utils/mapLanguageToStack";
import { ProjectItem } from "@/common/types/projects";

/** "my-repo-name" → "My Repo Name" */
export const humanizeName = (name: string): string =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** "my-repo-name" → "my-repo-name" (URL-safe slug) */
export const slugify = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Map a GithubRepo to a ProjectItem for use throughout the portfolio. */
export const repoToProjectItem = (repo: GithubRepo, index: number): ProjectItem => {
  const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
  const stacks = buildStackList(repo.primaryLanguage?.name ?? null, topics);

  return {
    id: index + 1,
    title: humanizeName(repo.name),
    slug: slugify(repo.name),
    description: repo.description ?? "A project by Krisna Taufik.",
    image: repo.openGraphImageUrl,
    link_github: repo.url,
    link_demo: repo.homepageUrl || null,
    stacks,
    content: null,
    is_show: true,
    is_featured: index === 0,
  };
};
