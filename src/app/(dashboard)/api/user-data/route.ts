import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { put } from "@vercel/blob";

// Helper to get session with proper error handling
async function getSession(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: Object.fromEntries(req.headers.entries())
    });
    if (!session) throw new Error("Unauthorized");
    return session;
  } catch (error) {
    console.error("Session error:", error);
    throw new Error("Unauthorized");
  }
}

// PATCH: update personal details (JSON)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();

    const allowedFields = ["name", "bio", "job", "country"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
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

    // 🔥 Force session refresh by updating updatedAt
    await prisma.user.update({
      where: { id: session.user.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("PATCH /api/user-data error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: upload avatar (multipart/form-data)
export async function POST(req: NextRequest) {
  let userId: string | null = null;
  
  try {
    const session = await getSession(req);
    userId = session.user.id;

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024;
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

    // Upload to Vercel Blob
    const blob = await put(`avatars/${session.user.id}-${Date.now()}.${file.type.split('/')[1]}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Update user's image field
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url, updatedAt: new Date() },
    });

    // 🔥 Return the updated user data so the client can update the session
    return NextResponse.json({ 
      success: true, 
      imageUrl: blob.url,
      user: updatedUser
    });
  } catch (error: any) {
    console.error("POST /api/user-data error:", error);
    
    // 🔥 If the error is authentication-related, don't log out the user
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Session expired. Please refresh the page." },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}