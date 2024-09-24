import { env } from "@/env";
import { GitHub } from "arctic";

type GithubUser = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    notification_email?: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    plan?: {
        collaborators: number;
        name: string;
        space: number;
        private_repos: number;
        [k: string]: unknown;
    };
    suspended_at?: string | null;
    private_gists?: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    disk_usage?: number;
    collaborators?: number;
};

type GithubEmail = {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
};

export const github = new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET
);

export async function getGithubUser(accessToken: string): Promise<GithubUser> {
    const response = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status !== 200) throw new Error("Failed to get github user.");

    return response.json();
}

export async function getGithubEmails(
    accessToken: string
): Promise<GithubEmail[]> {
    const response = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status !== 200)
        throw new Error("Failed to get github users emails.");

    return response.json();
}
