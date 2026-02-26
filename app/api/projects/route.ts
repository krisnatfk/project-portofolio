import { NextResponse } from "next/server";
import { getGithubPinnedRepos } from "@/services/github";
import { repoToProjectItem } from "@/common/utils/repoToProjectItem";
import { ProjectItem } from "@/common/types/projects";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const repos = await getGithubPinnedRepos();
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
