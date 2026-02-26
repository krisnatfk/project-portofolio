import { createClient } from "@/common/utils/server";

export interface ActivityItem {
    id: number;
    title: string;
    description: string;
    date: string;
    image: string;
    category: string;
    location: string;
    is_show: boolean;
}

export const getActivitiesData = async (): Promise<ActivityItem[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("activities")
        .select()
        .eq("is_show", true)
        .order("date", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((item) => {
        const { data: imageData } = supabase.storage
            .from("activities")
            .getPublicUrl(`${item.slug}.webp`);

        return {
            ...item,
            image: imageData.publicUrl,
        };
    });
};
