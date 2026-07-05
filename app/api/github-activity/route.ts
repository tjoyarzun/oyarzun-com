import { NextRequest, NextResponse } from "next/server";

// Cache responses for 24 hours
export const revalidate = 86400;

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
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

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: { username },
      }),
      next: { revalidate: 86400 },
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

    // Flatten weeks → days → levels (same shape GitHubHeatmap expects)
    const contributions: number[] = calendar.weeks.flatMap(
      (week: { contributionDays: { contributionCount: number }[] }) =>
        week.contributionDays.map((day) => countToLevel(day.contributionCount)),
    );

    return NextResponse.json({
      contributions,
      total: calendar.totalContributions,
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
