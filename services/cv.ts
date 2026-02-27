import { createClient } from "@/common/utils/server";

export const getCvUrl = () => {
    const supabase = createClient();

    const { data } = supabase.storage
        .from("cv")
        .getPublicUrl("latest.pdf");

    return data.publicUrl;
};
