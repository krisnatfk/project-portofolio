/**
 * Maps GitHub primary language names and repository topic names
 * to the STACKS constant keys used in the portfolio.
 */
const LANGUAGE_TO_STACK: Record<string, string> = {
  // Languages
  TypeScript: "TypeScript",
  JavaScript: "JavaScript",
  PHP: "PHP",
  Go: "Go",
  Kotlin: "Kotlin",
  Dart: "DART",
  Python: "Python",
  HTML: "HTML",
  CSS: "CSS",

  // Topics / Frameworks
  nextjs: "Next.js",
  "next.js": "Next.js",
  react: "React.js",
  "react.js": "React.js",
  vuejs: "Vue.js",
  "vue.js": "Vue.js",
  tailwindcss: "TailwindCSS",
  tailwind: "TailwindCSS",
  bootstrap: "Bootstrap",
  vite: "Vite",
  astro: "Astro.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  expressjs: "Express.js",
  "express.js": "Express.js",
  nestjs: "Nest.js",
  "nest.js": "Nest.js",
  laravel: "Laravel",
  prisma: "Prisma",
  supabase: "Supabase",
  firebase: "Firebase",
  mysql: "MySql",
  postgresql: "PostgreSql",
  postgres: "PostgreSql",
  mongodb: "MongoDb",
  docker: "Docker",
  redux: "Redux",
  jest: "Jest",
  typescript: "TypeScript",
  javascript: "JavaScript",
  kotlin: "Kotlin",
  "jetpack-compose": "Jetpack Compose",
  shadcn: "Shadcn UI",
  shadcnui: "Shadcn UI",
  zod: "Zod",
  axios: "Axios",
  framer: "Framer Motion",
  "framer-motion": "Framer Motion",
};

/**
 * Maps a GitHub primary language name to a STACKS key.
 */
export const mapLanguageToStack = (language: string | null): string | null => {
  if (!language) return null;
  return LANGUAGE_TO_STACK[language] ?? null;
};

/**
 * Maps a list of GitHub topic names to STACKS keys (filters unrecognised ones).
 */
export const mapTopicsToStacks = (topics: string[]): string[] => {
  return topics
    .map((t) => LANGUAGE_TO_STACK[t.toLowerCase()] ?? null)
    .filter((s): s is string => s !== null);
};

/**
 * Builds a deduplicated stack list from all detected languages + topics.
 */
export const buildStackList = (
  allLanguages: string[],
  topics: string[],
): string[] => {
  const stacks = new Set<string>();

  for (const lang of allLanguages) {
    const mapped = mapLanguageToStack(lang);
    if (mapped) stacks.add(mapped);
  }

  for (const stack of mapTopicsToStacks(topics)) {
    stacks.add(stack);
  }

  return Array.from(stacks);
};
