import Link from "next/link";
import { useTranslations } from "next-intl";
import { HiOutlineDownload as DownloadIcon } from "react-icons/hi";

const Introduction = () => {
  const t = useTranslations("HomePage");

  const paragraphData = [{ index: 1 }, { index: 2 }];

  return (
    <section className="space-y-2 bg-cover bg-no-repeat">
      <div className="text-3xl font-medium text-neutral-900 dark:text-neutral-50">
        <h1>{t("intro")}</h1>
      </div>

      <div className="space-y-4">
        <ul className="ml-5 flex list-disc flex-col gap-x-10 gap-y-2 text-neutral-700 dark:text-neutral-400 md:flex-row">
          <li>{t("location")}</li>
          <li>{t("location_type")}</li>
        </ul>
        <div className="mt-6 space-y-4 leading-7 text-neutral-600 dark:text-neutral-300">
          {paragraphData.map((paragraph) => (
            <div key={paragraph.index}>
              {t(`resume.paragraph_${paragraph.index}`)}
            </div>
          ))}
        </div>

        {/* CV Download Button */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/cv/krisna-taufik-cv.pdf"
            target="_blank"
            download
            className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-primary/80 active:scale-95"
          >
            <DownloadIcon
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0"
            />
            {t("download_cv")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Introduction;

