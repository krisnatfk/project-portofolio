import { NextResponse } from "next/server";
import { getAllPublicRepos, GithubRepo } from "@/services/github";
import { buildStackList } from "@/common/utils/mapLanguageToStack";
import { ProjectItem } from "@/common/types/projects";
import { HIDDEN_PROJECTS } from "@/common/constants/hiddenProjects";
import { PROJECT_CUSTOM_STACKS } from "@/common/constants/projectStacks";
import { MANUAL_PROJECTS } from "@/common/constants/manualProjects";
import { PROJECT_CUSTOM_URLS } from "@/common/constants/projectUrls";

export const dynamic = "force-dynamic";

const FEATURED_PROJECTS = ["project-portofolio"];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "projects";

const humanizeName = (name: string): string =>
  name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const slugify = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const getCustomThumbnailUrl = (slug: string): string =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${slug}.webp`;

const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

const applyCustomStacks = (slug: string, autoStacks: string[]): string[] => {
  const customConfig = PROJECT_CUSTOM_STACKS[slug];
  if (!customConfig) return autoStacks;
  if (customConfig.mode === "replace") return customConfig.stacks;
  return Array.from(new Set([...autoStacks, ...customConfig.stacks]));
};

export const GET = async () => {
  try {
    const repos = await getAllPublicRepos();

    const hiddenLower = HIDDEN_PROJECTS.map(h => h.toLowerCase());

    // Filter out hidden projects
    const visibleRepos = repos.filter(
      (repo) => !hiddenLower.includes(slugify(repo.name)),
    );

    // GitHub-detected projects
    const ghProjects: ProjectItem[] = await Promise.all(
      visibleRepos.map(async (repo, index) => {
        const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
        const allLanguages = repo.languages?.nodes?.length
          ? repo.languages.nodes.map((n) => n.name)
          : repo.primaryLanguage ? [repo.primaryLanguage.name] : [];
        const autoStacks = buildStackList(allLanguages, topics);
        const slug = slugify(repo.name);
        const stacks = applyCustomStacks(slug, autoStacks);

        const customUrl = getCustomThumbnailUrl(slug);
        const hasCustom = await checkImageExists(customUrl);

        return {
          id: index + 1,
          title: humanizeName(repo.name),
          slug,
          description: repo.description ?? "A project by Krisna Taufik.",
          image: hasCustom ? customUrl : repo.openGraphImageUrl,
          link_github: repo.url,
          link_demo: PROJECT_CUSTOM_URLS[slug] || repo.homepageUrl || null,
          stacks,
          content: null,
          is_show: true,
          is_featured: false,
        };
      }),
    );

    // Manual projects (repos not detected by GitHub GraphQL)
    const existingSlugs = new Set(ghProjects.map(p => p.slug));
    const manualFiltered = MANUAL_PROJECTS.filter(
      (mp) => !hiddenLower.includes(slugify(mp.name)) && !existingSlugs.has(slugify(mp.name)),
    );

    const manualItems: ProjectItem[] = await Promise.all(
      manualFiltered.map(async (mp, index) => {
        const slug = slugify(mp.name);
        const autoStacks = buildStackList(mp.languages, mp.topics);
        const stacks = applyCustomStacks(slug, autoStacks);

        const customUrl = getCustomThumbnailUrl(slug);
        const hasCustom = await checkImageExists(customUrl);

        return {
          id: ghProjects.length + index + 1,
          title: humanizeName(mp.name),
          slug,
          description: mp.description,
          image: hasCustom ? customUrl : `https://opengraph.githubassets.com/1/${mp.url.replace("https://github.com/", "")}`,
          link_github: mp.url,
          link_demo: PROJECT_CUSTOM_URLS[slug] || mp.homepageUrl || null,
          stacks,
          content: null,
          is_show: true,
          is_featured: false,
        };
      }),
    );

    const allProjects = [...ghProjects, ...manualItems].map((p) => ({
      ...p,
      is_featured: FEATURED_PROJECTS.includes(p.slug),
    })).sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });

    return NextResponse.json(allProjects, { status: 200 });
  } catch (error: any) {
    console.error("Projects API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
