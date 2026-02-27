import Image from "next/image";
import { BsBuildings as CompanyIcon } from "react-icons/bs";

import { EducationProps } from "@/common/types/education";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

const EducationCard = ({
  school,
  major,
  logo,
  degree,
  start_year,
  end_year,
  link,
  location,
  GPA,
}: EducationProps) => {
  return (
    <SpotlightCard className="flex items-start gap-5 p-6">
      {logo ? (
        <Image
          width={64}
          height={64}
          src={logo}
          alt={school}
          className="h-16 w-16 shrink-0 rounded-lg object-contain"
        />
      ) : (
        <CompanyIcon size={50} className="shrink-0 text-neutral-500" />
      )}

      <div className="space-y-1">
        <a href={link || "#"} target="_blank">
          <h6>{school}</h6>
        </a>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex flex-col gap-1 md:flex-row md:gap-2">
            <span>{degree}</span>
            <span className="hidden text-neutral-300 dark:text-neutral-700 md:block">
              •
            </span>
            <span>{major}</span>
            {GPA && (
              <div className="flex gap-2">
                <span className="hidden text-neutral-300 dark:text-neutral-700 md:block">
                  •
                </span>
                <span>GPA: </span>
                <span>{GPA}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[12px] md:flex-row md:gap-2">
            <span className="dark:text-neutral-500">
              {start_year} - {end_year}
            </span>
            <span className="hidden rounded-full text-neutral-300 dark:text-neutral-700 md:block">
              •
            </span>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default EducationCard;
