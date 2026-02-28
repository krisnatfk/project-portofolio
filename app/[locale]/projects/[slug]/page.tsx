import { Metadata } from "next";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";
import { getAllPublicRepos } from "@/services/github";
import { repoToProjectItem, slugify } from "@/common/utils/repoToProjectItem";

interface ProjectDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const getCustomThumbnailUrl = (slug: string): string =>
  `${SUPABASE_URL}/storage/v1/object/public/projects/${slug}.webp`;

const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

import { notFound } from "next/navigation";

const getProjectDetail = async (slug: string): Promise<ProjectItem | null> => {
  const repos = await getAllPublicRepos();
  const projectItems = repos.map(repoToProjectItem);
  const project = projectItems.find((p) => p.slug === slug);

  if (!project) return null;

  // Check for custom thumbnail
  const customUrl = getCustomThumbnailUrl(slug);
  const hasCustom = await checkImageExists(customUrl);
  if (hasCustom) {
    project.image = customUrl;
  }

  const contents = loadMdxFiles();
  const content = contents.find((item) => item.slug === slug);

  return JSON.parse(JSON.stringify({ ...project, content: content?.content ?? null }));
};


export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const project = await getProjectDetail(params?.slug);
  const locale = params.locale || "en";

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} ${METADATA.exTitle}`,
    description: project.description,
    openGraph: {
      images: project.image,
      url: `${METADATA.openGraph.url}/${project.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
    },
    keywords: project.title,
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}/projects/${params.slug}`,
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const data = await getProjectDetail(params?.slug);

  if (!data) return notFound();

  return (
    <Container data-aos="fade-up">
      <BackButton url="/projects" />
      <PageHeading title={data.title} description={data.description} />
      <ProjectDetail {...data} />
    </Container>
  );
};

export default ProjectDetailPage;
