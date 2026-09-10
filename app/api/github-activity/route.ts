import { NextRequest, NextResponse } from "next/server";
import { getContributions } from "@/lib/github";

/**
 * Client-facing wrapper over lib/github.ts.
 *
 * The redesign renders the commit figure and the activity grid on the server,
 * so nothing on the live site calls this any more — the pre-redesign
 * components under components/{home,dashboard,profiles} still do, and they
 * stay on disk until the redesign reaches production.
 *
 * It delegates rather than re-implementing the query, so there is exactly one
 * place that knows how to talk to GitHub. When the orphaned components go,
 * this goes with them.
 */
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const c = await getContributions(username);
  if (!c.ok) {
    return NextResponse.json(
      { error: c.reason ?? "unavailable" },
      { status: c.reason?.includes("TOKEN") ? 503 : 502 },
    );
  }

  return NextResponse.json(
    { contributions: c.levels, dates: c.dates, total: c.total },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    },
  );
}
