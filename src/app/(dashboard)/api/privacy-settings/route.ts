import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/privacy-settings - starting");

    const session = await auth.api.getSession({ headers: request.headers });
    console.log("Session:", session ? "found" : "not found");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if prisma.settings exists
    if (!prisma.settings) {
      console.error(
        "prisma.settings is undefined. Did you run prisma generate?",
      );
      return NextResponse.json(
        { error: "Database model not available. Please run prisma generate." },
        { status: 500 },
      );
    }

    const userId = session.user.id;
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Return defaults
      return NextResponse.json({
        data: {
          onlineStatus: true,
          lastSeen: true,
          showBio: true,
          showJob: true,
          showCountry: true,
          syncEmails: true,
          allowSearch: true,
        },
      });
    }

    const responseData = {
      onlineStatus: settings.onlineStatusVisible,
      lastSeen: settings.lastSeenVisible,
      showBio: settings.bioVisible,
      showJob: settings.jobVisible,
      showCountry: settings.countryVisible,
      syncEmails: settings.syncEmails,
      allowSearch: settings.allowSearch,
    };

    return NextResponse.json({ data: responseData });
  } catch (error: any) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to load privacy settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("PUT /api/privacy-settings - starting");

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check prisma.settings again
    if (!prisma.settings) {
      console.error("prisma.settings is undefined");
      return NextResponse.json(
        { error: "Database model not available" },
        { status: 500 },
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const updateData: any = {};
    if (body.onlineStatus !== undefined)
      updateData.onlineStatusVisible = body.onlineStatus;
    if (body.lastSeen !== undefined) updateData.lastSeenVisible = body.lastSeen;
    if (body.showBio !== undefined) updateData.bioVisible = body.showBio;
    if (body.showJob !== undefined) updateData.jobVisible = body.showJob;
    if (body.showCountry !== undefined)
      updateData.countryVisible = body.showCountry;
    if (body.syncEmails !== undefined) updateData.syncEmails = body.syncEmails;
    if (body.allowSearch !== undefined)
      updateData.allowSearch = body.allowSearch;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    const settings = await prisma.settings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    const responseData = {
      onlineStatus: settings.onlineStatusVisible,
      lastSeen: settings.lastSeenVisible,
      showBio: settings.bioVisible,
      showJob: settings.jobVisible,
      showCountry: settings.countryVisible,
      syncEmails: settings.syncEmails,
      allowSearch: settings.allowSearch,
    };

    return NextResponse.json({ data: responseData });
  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to save privacy settings" },
      { status: 500 },
    );
  }
}
