"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function changeEmailAction(
  newEmail: string,
): Promise<ActionResult> {
  try {
    if (!newEmail) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    const result = await auth.api.changeEmail({
      headers: await headers(),
      body: {
        newEmail,
      },
    });

    // Check if result has error property
    if (result && typeof result === "object" && "error" in result) {
      return {
        success: false,
        error: (result as any).error.message ?? "Failed to update email",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Email update error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePasswordAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;

    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: "Missing password fields",
      };
    }

    const result = await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });

    // Check if result has error property
    if (result && typeof result === "object" && "error" in result) {
      return {
        success: false,
        error: (result as any).error.message ?? "Failed to update password",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
