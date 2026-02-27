import { NextResponse } from "next/server";
import { getGithubPinnedRepos, GithubRepo } from "@/services/github";
import { buildStackList } from "@/common/utils/mapLanguageToStack";
import { ProjectItem } from "@/common/types/projects";

/** Convert a GitHub repo name like "my-cool-app" → "My Cool App" */
const humanizeName = (name: string): string =>
  name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Slugify a repo name → URL-safe slug */
const slugify = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const repoToProjectItem = (repo: GithubRepo, index: number): ProjectItem => {
  const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
  const allLanguages = repo.languages?.nodes?.length
    ? repo.languages.nodes.map((n) => n.name)
    : repo.primaryLanguage ? [repo.primaryLanguage.name] : [];
  const stacks = buildStackList(allLanguages, topics);

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
    is_featured: index === 0, // First pinned repo is featured
  };
};

export const GET = async () => {
  try {
    const repos = await getGithubPinnedRepos();
    const projects: ProjectItem[] = repos.map(repoToProjectItem);

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("GitHub Repos API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
