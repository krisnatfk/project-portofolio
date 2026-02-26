"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose as CloseIcon } from "react-icons/io5";
import { HiOutlineLocationMarker as LocationIcon } from "react-icons/hi";
import { BsCalendar3 as CalendarIcon } from "react-icons/bs";
import { MdOutlineCategory as CategoryIcon } from "react-icons/md";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import Portal from "@/common/components/elements/Portal";

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

const ActivityCard = ({
    title,
    description,
    date,
    image,
    category,
    location,
}: ActivityItem) => {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("ActivitiesPage");

    const formattedDate = date ? format(parseISO(date), "dd MMMM yyyy") : "";

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <motion.div
                layoutId={`activity-card-${title}-${date}`}
                onClick={() => setIsOpen(true)}
                className="h-full cursor-pointer"
            >
                <SpotlightCard className="group flex h-full flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                        <motion.div layoutId={`activity-image-${title}-${date}`}>
                            <Image
                                src={image}
                                alt={title}
                                width={500}
                                height={300}
                                className="h-[180px] w-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105 md:h-[200px]"
                            />
                        </motion.div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="text-sm font-medium">{t("view_detail")}</span>
                        </div>

                        {/* Category badge */}
                        <div className="absolute left-3 top-3">
                            <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold capitalize text-dark backdrop-blur-sm">
                                {category}
                            </span>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                        <div className="space-y-1.5">
                            <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {title}
                            </h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                {description}
                            </p>
                        </div>

                        <div className="space-y-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                            {location && (
                                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                                    <LocationIcon size={12} />
                                    <span className="line-clamp-1 text-[11px]">{location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
                                <CalendarIcon size={11} />
                                <span className="text-[11px]">{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </SpotlightCard>
            </motion.div>

            {/* Modal Detail */}
            <Portal>
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            {/* Modal */}
                            <motion.div
                                layoutId={`activity-card-${title}-${date}`}
                                className="relative z-[10000] flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-4 top-4 z-[10001] rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                                >
                                    <CloseIcon size={20} />
                                </button>

                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 md:max-w-[60%]">
                                        <motion.div layoutId={`activity-image-${title}-${date}`}>
                                            <Image
                                                src={image}
                                                alt={title}
                                                width={1000}
                                                height={700}
                                                className="h-full max-h-[50vh] w-full object-cover md:max-h-[85vh]"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Detail */}
                                    <div className="flex flex-col gap-4 overflow-y-auto p-6 md:w-[40%]">
                                        {/* Category Badge */}
                                        <span className="w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold capitalize text-primary">
                                            {category}
                                        </span>

                                        <h2 className="text-xl font-bold leading-snug text-neutral-900 dark:text-white">
                                            {title}
                                        </h2>

                                        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                            {description}
                                        </p>

                                        <div className="mt-2 space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                                            {location && (
                                                <div className="flex items-start gap-2 text-neutral-500 dark:text-neutral-400">
                                                    <LocationIcon size={15} className="mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                                            {t("location")}
                                                        </p>
                                                        <p className="text-sm dark:text-neutral-300">{location}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-2 text-neutral-500 dark:text-neutral-400">
                                                <CalendarIcon size={13} className="mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                                        {t("date")}
                                                    </p>
                                                    <p className="text-sm dark:text-neutral-300">{formattedDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-neutral-500 dark:text-neutral-400">
                                                <CategoryIcon size={15} className="mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                                        {t("category")}
                                                    </p>
                                                    <p className="text-sm capitalize dark:text-neutral-300">{category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Portal>
        </>
    );
};

export default ActivityCard;
