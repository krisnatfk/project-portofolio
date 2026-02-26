import { createAdminClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from("messages")
      .select()
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Chat GET error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const supabase = createAdminClient();
  try {
    const body = await req.json();
    const { error } = await supabase.from("messages").insert([body]);

    if (error) {
      console.error("Chat POST error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json("Data saved successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};