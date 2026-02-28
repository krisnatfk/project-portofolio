import { HIDDEN_PROJECTS } from "./common/constants/hiddenProjects";
import { getAllPublicRepos } from "./services/github";
import { slugify } from "./common/utils/repoToProjectItem";

async function check() {
    const repos = await getAllPublicRepos();

    const hiddenLowercase = HIDDEN_PROJECTS.map(h => h.toLowerCase());

    console.log("HIDDEN ARRAY:", hiddenLowercase);

    const bgRemove = repos.find(r => r.name.toLowerCase().includes("bg"));

    if (bgRemove) {
        console.log("Found repo on GitHub (cached):", bgRemove.name);
        const slug = slugify(bgRemove.name);
        console.log("Slugified:", slug);
        console.log("Should hide?", hiddenLowercase.includes(slug));
    } else {
        console.log("Repo not found in getAllPublicRepos! It dropped from cache.");
    }
}

check().catch(console.error);
