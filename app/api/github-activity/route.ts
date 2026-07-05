import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

// Explicitly pass from/to so we always get the last 52 weeks ending today.
const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 503 },
    );
  }

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: {
          username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json({ error: "No data returned" }, { status: 502 });
    }

    type ContribDay = { contributionCount: number; date: string };
    type ContribWeek = { contributionDays: ContribDay[] };

    // Flatten to parallel arrays so the client can compute accurate month labels
    const days = calendar.weeks.flatMap((w: ContribWeek) => w.contributionDays);
    const contributions: number[] = days.map((d: ContribDay) =>
      countToLevel(d.contributionCount),
    );
    const dates: string[] = days.map((d: ContribDay) => d.date);

    return NextResponse.json({
      contributions,
      dates,
      total: calendar.totalContributions,
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
