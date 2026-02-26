import { NextResponse } from "next/server";
import { getActivitiesData } from "@/services/activities";

export const GET = async () => {
    try {
        const data = await getActivitiesData();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("[activities API error]:", error);
        return NextResponse.json(
            { message: "Internal Server Error", detail: String(error) },
            { status: 500 },
        );
    }
};
