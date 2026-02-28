import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";

interface ProjectDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

/**
 * Fetch project data from the internal /api/projects endpoint.
 * This is critical: the API route is proven to work on Vercel,
 * while direct getAllPublicRepos() calls from server components
 * can return empty results due to unstable_cache behavior during build.
 */
const getProjectDetail = async (slug: string): Promise<ProjectItem | null> => {
  try {
    // Build the absolute URL for internal API call
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch projects from API:", res.status);
      return null;
    }

    const projects: ProjectItem[] = await res.json();
    const project = projects.find((p) => p.slug === slug);

    if (!project) return null;

    // Load MDX content if available
    const contents = loadMdxFiles();
    const content = contents.find((item) => item.slug === slug);

    return { ...project, content: content?.content ?? null };
  } catch (error) {
    console.error("Error fetching project detail:", error);
    return null;
  }
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
