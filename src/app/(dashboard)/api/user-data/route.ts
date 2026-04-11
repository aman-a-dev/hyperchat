import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // your Better Auth instance
import prisma from '@/lib/prisma'; // your Prisma client
import { put } from "@vercel/blob"; // example storage – replace with your own

// Helper to get session
async function getSession(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) throw new Error("Unauthorized");
  return session;
}

// PATCH: update personal details (JSON)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();

    // Allowed fields to update
    const allowedFields = ["name", "bio", "job", "country"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // optional: add validation here
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("PATCH /api/user-data error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

// POST: upload avatar (multipart/form-data)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file (similar to client-side validateImage)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 },
      );
    }
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Upload to storage – example using Vercel Blob (or any other)
    // Replace with your own upload logic (S3, Uploadthing, etc.)
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Update user's image field
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url },
    });

    return NextResponse.json({ success: true, imageUrl: blob.url });
  } catch (error: any) {
    console.error("POST /api/user-data error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
