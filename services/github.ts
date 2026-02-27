import axios from "axios";
import { GITHUB_ACCOUNTS } from "@/common/constants/github";
import { unstable_cache } from "next/cache";

export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  openGraphImageUrl: string;
  primaryLanguage: { name: string } | null;
  languages?: { nodes: { name: string }[] };
  repositoryTopics: { nodes: { topic: { name: string } }[] };
};

const GITHUB_USER_ENDPOINT = "https://api.github.com/graphql";

const GITHUB_USER_QUERY = `query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        colors
        totalContributions
        months {
          firstDay
          name
          totalWeeks
        }
        weeks {
          contributionDays {
            color
            contributionCount
            date
          }
          firstDay
        }
      }
    }
  }
}`;

const GITHUB_PINNED_REPOS_QUERY = `query($username: String!) {
  user(login: $username) {
    pinnedItems(first: 10, types: REPOSITORY) {
      totalCount
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          openGraphImageUrl
          primaryLanguage {
            name
          }
          languages(first: 10) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
}`;

const GITHUB_RECENT_REPOS_QUERY = `query($username: String!) {
  user(login: $username) {
    repositories(
      first: 100
      orderBy: { field: UPDATED_AT, direction: DESC }
      isFork: false
      privacy: PUBLIC
    ) {
      nodes {
        name
        description
        url
        homepageUrl
        openGraphImageUrl
        primaryLanguage {
          name
        }
        languages(first: 10) {
          nodes {
            name
          }
        }
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
  }
}`;

const fetchGithubPinnedRepos = async (username: string, token: string): Promise<GithubRepo[]> => {
  try {
    const pinnedResponse = await axios.post(
      GITHUB_USER_ENDPOINT,
      { query: GITHUB_PINNED_REPOS_QUERY, variables: { username } },
      { headers: { Authorization: `bearer ${token}` } },
    );

    const pinnedData = pinnedResponse.data?.data?.user?.pinnedItems;

    // If user has pinned repos, use them
    if (pinnedData?.totalCount > 0) {
      return pinnedData.nodes ?? [];
    }

    // Fallback: fetch most recent public non-fork repos
    const recentResponse = await axios.post(
      GITHUB_USER_ENDPOINT,
      { query: GITHUB_RECENT_REPOS_QUERY, variables: { username } },
      { headers: { Authorization: `bearer ${token}` } },
    );

    return recentResponse.data?.data?.user?.repositories?.nodes ?? [];
  } catch (error) {
    console.error("GitHub Repos API Error:", error);
    return [];
  }
};

const getCachedPinnedRepos = unstable_cache(
  async (username: string, token: string) => fetchGithubPinnedRepos(username, token),
  ["github-repos-v2"],
  {
    revalidate: 3600,
    tags: ["github-repos-tag"],
  },
);

export const getGithubPinnedRepos = async (): Promise<GithubRepo[]> => {
  const { username, token } = GITHUB_ACCOUNTS;

  if (!username || !token) return [];

  return getCachedPinnedRepos(username, token);
};

const fetchAllPublicRepos = async (username: string, token: string): Promise<GithubRepo[]> => {
  try {
    const response = await axios.post(
      GITHUB_USER_ENDPOINT,
      { query: GITHUB_RECENT_REPOS_QUERY, variables: { username } },
      { headers: { Authorization: `bearer ${token}` } },
    );
    return response.data?.data?.user?.repositories?.nodes ?? [];
  } catch (error) {
    console.error("GitHub All Repos API Error:", error);
    return [];
  }
};

const getCachedAllPublicRepos = unstable_cache(
  async (username: string, token: string) => fetchAllPublicRepos(username, token),
  ["github-all-repos-v1"],
  { revalidate: 3600, tags: ["github-all-repos-tag"] },
);

export const getAllPublicRepos = async (): Promise<GithubRepo[]> => {
  const { username, token } = GITHUB_ACCOUNTS;
  if (!username || !token) return [];
  return getCachedAllPublicRepos(username, token);
};

const fetchGithubData = async (username: string, token: string) => {
  try {
    const response = await axios.post(
      GITHUB_USER_ENDPOINT,
      {
        query: GITHUB_USER_QUERY,
        variables: { username },
      },
      {
        headers: { Authorization: `bearer ${token}` },
      },
    );

    return response.data.data.user;
  } catch (error) {
    console.error("GitHub API Error:", error);
    return null;
  }
};

const getCachedGithubData = unstable_cache(
  async (username: string, token: string) => fetchGithubData(username, token),
  ["github-stats-cache-key"],
  {
    revalidate: 3600,
    tags: ["github-stats-tag"],
  },
);

export const getGithubData = async () => {
  const { username, token } = GITHUB_ACCOUNTS;

  if (!username || !token) {
    return { status: 500, data: null };
  }

  const data = await getCachedGithubData(username, token);

  if (!data) {
    return { status: 502, data: null };
  }

  return { status: 200, data };
};
