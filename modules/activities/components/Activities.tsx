"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fetcher } from "@/services/fetcher";

import EmptyState from "@/common/components/elements/EmptyState";
import ActivityCard, { ActivityItem } from "./ActivityCard";
import ActivitySkeleton from "./ActivitySkeleton";

const Activities = () => {
    const t = useTranslations("ActivitiesPage");

    const { data, isLoading, error } = useSWR<ActivityItem[]>(
        "/api/activities",
        fetcher,
    );

    const activities = data ?? [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <ActivitySkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) return <EmptyState message={t("error")} />;

    if (activities.length === 0) return <EmptyState message={t("no_data")} />;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {activities.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                    <ActivityCard {...item} />
                </motion.div>
            ))}
        </div>
    );
};

export default Activities;
