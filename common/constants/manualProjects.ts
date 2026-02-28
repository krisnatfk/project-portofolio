/**
 * Manual Projects
 *
 * Tambahkan project yang TIDAK terdeteksi oleh GitHub GraphQL API di sini.
 * Ini biasanya terjadi pada repo yang di-clone dari repo orang lain
 * lalu di-push ke akun sendiri — GitHub kadang menandainya secara internal.
 *
 * Format: sama seperti ProjectItem, tapi tanpa id (akan di-generate otomatis).
 */
export const MANUAL_PROJECTS: {
    name: string;
    description: string;
    url: string;
    homepageUrl: string | null;
    languages: string[];
    topics: string[];
}[] = [
        {
            name: "furni.app",
            description: "Furniture E-Commerce Web Application with Admin Dashboard",
            url: "https://github.com/krisnatfk/furni.app",
            homepageUrl: null,
            languages: ["PHP", "CSS", "JavaScript"],
            topics: ["laravel", "filament", "tailwindcss", "mysql"],
        },
        // Tambahkan project lain yang tidak terdeteksi di sini
    ];
