import { NextResponse } from "next/server";

/**
 * GET /api/tiktok/auth
 * Redirects the user to TikTok's OAuth authorization page.
 * Visit this URL in browser to start the TikTok login flow.
 */
export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const redirectUri = `${process.env.DOMAIN}/api/tiktok/callback`;

  const scopes = [
    "user.info.basic",
    "user.info.profile",
    "user.info.stats",
    "video.list",
  ].join(",");

  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.set("client_key", clientKey);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
