export type I18nText = { en: string; id: string };

export interface CareerProps {
  position: I18nText;
  company: I18nText;
  logo: string | null;
  location: string;
  location_type: "Onsite" | "Remote" | "Hybrid";
  type: I18nText;
  start_date: string;
  end_date: string | null;
  industry: I18nText;
  link: string | null;
  responsibilities?: I18nText[];
  lessons_learned?: I18nText[];
  impact?: I18nText[];
  indexCareer?: number;
  isShow?: boolean;
}
