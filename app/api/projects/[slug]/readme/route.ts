import { NextResponse } from "next/server";

import { getRepoReadme } from "@/services/github";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  try {
    const { slug } = params;
    const data = await getRepoReadme(slug);
    
    if (!data) {
      return NextResponse.json({ content: null }, { status: 404 });
    }

    return NextResponse.json({ content: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
