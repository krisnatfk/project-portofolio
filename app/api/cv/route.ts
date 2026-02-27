import { NextResponse } from "next/server";
import { getCvUrl } from "@/services/cv";

const CV_FILENAME = "CV- Krisna Taufik.pdf";

export const GET = async () => {
    try {
        const cvUrl = getCvUrl();

        // Fetch the file from Supabase and proxy it with download headers
        const response = await fetch(cvUrl);

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch CV file" },
                { status: 502 },
            );
        }

        const fileBuffer = await response.arrayBuffer();

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${CV_FILENAME}"`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get CV URL" },
            { status: 500 },
        );
    }
};
