export type I18nText = { en: string; id: string };

export type EducationProps = {
  school: string;
  major: I18nText;
  logo: string;
  location: string;
  degree: I18nText;
  GPA?: string;
  start_year: number;
  end_year: number;
  link: string;
};
