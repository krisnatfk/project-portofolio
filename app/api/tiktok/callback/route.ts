import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createAdminClient } from "@/common/utils/server";

const STATIC_ID = "00000000-0000-0000-0000-000000000001";

/**
 * GET /api/tiktok/callback
 * TikTok redirects here after the user authorizes the app.
 * Exchanges the code for tokens and saves them to Supabase.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.json(
      { error: error || "No code received from TikTok" },
      { status: 400 },
    );
  }

  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY!;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
    const redirectUri = `${process.env.DOMAIN}/api/tiktok/callback`;

    // Exchange code for access token
    const params = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const tokenRes = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const tokenData = tokenRes.data;

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to get access token", data: tokenData },
        { status: 500 },
      );
    }

    // Save tokens to Supabase
    const supabase = createAdminClient();
    const expiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000,
    ).toISOString();
    const refreshExpiresAt = new Date(
      Date.now() + (tokenData.refresh_expires_in || 15552000) * 1000,
    ).toISOString();

    const { error: dbError } = await supabase.from("tiktok_tokens").upsert({
      id: STATIC_ID,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      refresh_expires_at: refreshExpiresAt,
      updated_at: new Date().toISOString(),
    });

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to save token to database", details: dbError.message },
        { status: 500 },
      );
    }

    // Redirect back to the contents page
    return NextResponse.redirect(`${process.env.DOMAIN}/en/contents?tiktok=connected`);
  } catch (err: any) {
    console.error("TikTok callback error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "OAuth exchange failed", details: err?.response?.data || err.message },
      { status: 500 },
    );
  }
}
