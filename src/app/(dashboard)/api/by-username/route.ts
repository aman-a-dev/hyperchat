import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.trim();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Find user where email starts with username + '@' (case‑insensitive).
    // Assumes the database column has a case‑insensitive collation (e.g., utf8mb4_unicode_ci).
    const user = await prisma.user.findFirst({
      where: {
        email: {
          startsWith: username + "@",
        },
      },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default all fields to visible if no settings record exists
    const settings = user.settings || {
      bioVisible: true,
      jobVisible: true,
      countryVisible: true,
    };

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image,
      bio: settings.bioVisible ? user.bio : null,
      job: settings.jobVisible ? user.job : null,
      country: settings.countryVisible ? user.country : null,
    };

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
