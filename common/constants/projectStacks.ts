/**
 * Custom Tech Stacks per Project
 *
 * Override atau tambahkan tech stacks untuk project tertentu.
 * Key = slug project (huruf kecil, pakai strip)
 * Value = array nama stack (harus sesuai dengan key di STACKS di stacks.tsx)
 *
 * Mode:
 * - "merge"   → gabungkan custom stacks dengan auto-detected (default)
 * - "replace"  → ganti semua auto-detected stacks dengan custom stacks
 *
 * Daftar nama stack yang tersedia:
 * ─────────────────────────────────────────────
 * HTML, CSS, Bootstrap, TailwindCSS,
 * JavaScript, TypeScript, React.js, Vue.js,
 * Next.js, Vite, Astro.js, Shadcn UI,
 * Node.js, Express.js, Nest.js,
 * PHP, Laravel, Go, Kotlin, Jetpack Compose,
 * Prisma, Supabase, Firebase,
 * PostgreSql, MySql, MongoDb,
 * Redux, Framer Motion, Axios, Zod,
 * NextAuth.js, React Hook Form, React Table,
 * React Router, Docker, Jest, AI,
 * Npm, Yarn, bun, Github
 * ─────────────────────────────────────────────
 *
 * Contoh:
 * "quickcart": {
 *   mode: "merge",
 *   stacks: ["Laravel", "MySql", "Bootstrap"],
 * },
 */
export const PROJECT_CUSTOM_STACKS: Record<
    string,
    { mode: "merge" | "replace"; stacks: string[] }
> = {
    "krisna-portofolio": {
        mode: "replace",
        stacks: ["React.js", "JavaScript", "TailwindCSS", "Vite"],
    },
    "project-portofolio": {
        mode: "replace",
        stacks: ["Next.js", "React.js", "TypeScript", "TailwindCSS", "Supabase", "PostgreSql", "bun", "Framer Motion", "NextAuth.js"],
    },
    "project-manager": {
        mode: "replace",
        stacks: ["PHP", "Laravel", "Filament", "TailwindCSS", "MySql"],
    },
    // "web-ayam-fillet": {
    //     mode: "replace",
    //     stacks: ["Next.js", "React.js", "Express.js", "Node.js", "TailwindCSS", "TypeScript"],
    // },
    "e-commerce": {
        mode: "replace",
        stacks: ["Next.js", "React.js", "Express.js", "Node.js", "TailwindCSS", "TypeScript"],
    },
    "quickshow": {
        mode: "replace",
        stacks: ["Next.js", "React.js", "Express.js", "Node.js", "TailwindCSS", "TypeScript", "JavaScript"],
    },
    "quickcart": {
        mode: "replace",
        stacks: ["Next.js", "React.js", "Express.js", "Node.js", "TailwindCSS", "TypeScript", "JavaScript"],
    },
    "edupath-school": {
        mode: "replace",
        stacks: ["Flutter", "Dart", "Firebase"],
    },
    "inventory-ayam-fix": {
        mode: "replace",
        stacks: ["Laravel", "PHP", "MySql", "Bootstrap", "TailwindCSS", "Vite", "Axios"],
    },
    "furni-app": {
        mode: "replace",
        stacks: ["Laravel", "PHP", "MySql", "Bootstrap", "Filament", "TailwindCSS", "Vite", "Axios"],
    },
    "sistem-absensi-sekolah": {
        mode: "replace",
        stacks: ["Laravel", "PHP", "MySql", "Filament", "TailwindCSS", "Vite", "Axios"],
    },
};
