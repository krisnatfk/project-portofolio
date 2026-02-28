import { NextResponse } from "next/server";
import { getAllPublicRepos, GithubRepo } from "@/services/github";
import { buildStackList } from "@/common/utils/mapLanguageToStack";
import { ProjectItem } from "@/common/types/projects";
import { HIDDEN_PROJECTS } from "@/common/constants/hiddenProjects";

export const dynamic = "force-dynamic";

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

export const GET = async () => {
  try {
    const repos = await getAllPublicRepos();

    // Filter out hidden projects
    const visibleRepos = repos.filter(
      (repo) => !HIDDEN_PROJECTS.map(h => h.toLowerCase()).includes(slugify(repo.name)),
    );

    const projects: ProjectItem[] = await Promise.all(
      visibleRepos.map(async (repo, index) => {
        const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
        const allLanguages = repo.languages?.nodes?.length
          ? repo.languages.nodes.map((n) => n.name)
          : repo.primaryLanguage ? [repo.primaryLanguage.name] : [];
        const stacks = buildStackList(allLanguages, topics);
        const slug = slugify(repo.name);

        // Check if custom thumbnail exists in Supabase Storage
        const customUrl = getCustomThumbnailUrl(slug);
        const hasCustom = await checkImageExists(customUrl);

        return {
          id: index + 1,
          title: humanizeName(repo.name),
          slug,
          description: repo.description ?? "A project by Krisna Taufik.",
          image: hasCustom ? customUrl : repo.openGraphImageUrl,
          link_github: repo.url,
          link_demo: repo.homepageUrl || null,
          stacks,
          content: null,
          is_show: true,
          is_featured: false,
        };
      }),
    );

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("Projects API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
