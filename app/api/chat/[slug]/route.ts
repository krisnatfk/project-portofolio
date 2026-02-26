import { NextResponse } from "next/server";
import { createAdminClient } from "@/common/utils/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  const supabase = createAdminClient();
  try {
    const id = params.slug;
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      console.error("Chat DELETE error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("Deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
