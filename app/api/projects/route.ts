import { NextResponse } from "next/server";
import { getAllPublicRepos, GithubRepo } from "@/services/github";
import { buildStackList } from "@/common/utils/mapLanguageToStack";
import { ProjectItem } from "@/common/types/projects";

export const dynamic = "force-dynamic";

const humanizeName = (name: string): string =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const slugify = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const repoToProjectItem = (repo: GithubRepo, index: number): ProjectItem => {
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
    is_featured: false,
  };
};

export const GET = async () => {
  try {
    const repos = await getAllPublicRepos();
    const projects: ProjectItem[] = repos.map(repoToProjectItem);
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("Projects API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
