// app/api/user-search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    console.log("Searching for:", query);

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } }, // removed mode
              { email: { contains: query } }, // removed mode
            ],
          },
          {
            // Allow users with settings where allowSearch is true,
            // AND also users who have no settings record at all (default to true).
            OR: [{ settings: { allowSearch: true } }, { settings: null }],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        job: true,
        country: true,
      },
      take: 10,
    });

    console.log("Found users:", users.length);
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
