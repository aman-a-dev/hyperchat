import { toast } from "sonner";

/* -------------------- Utils -------------------- */

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
};

/* -------------------- Auth -------------------- */

export function validateSignUp(
  name: string,
  email: string,
  password: string,
): boolean {
  if (!name || !email || !password) {
    toast.error("Missing Fields", { description: "All inputs are required." });
    return false;
  }

  if (name.trim().length < 2) {
    toast.error("Invalid Name", {
      description: "Name must be at least 2 characters.",
    });
    return false;
  }

  if (!validateEmail(email)) {
    toast.error("Invalid Email", {
      description: "Please enter a valid email address.",
    });
    return false;
  }

  if (password.trim().length < 8) {
    toast.error("Weak Password", {
      description: "Password must be at least 8 characters long.",
    });
    return false;
  }

  return true;
}

export function validateSignIn(email: string, password: string): boolean {
  if (!email || !password) {
    toast.error("Missing Fields", {
      description: "Email and password are required.",
    });
    return false;
  }

  if (!validateEmail(email)) {
    toast.error("Invalid Email", {
      description: "Please enter a valid email format.",
    });
    return false;
  }

  return true;
}

/* -------------------- User Profile -------------------- */

export function validateChangeUserData(
  name: string,
  bio: string,
  job: string,
  country?: string,
): boolean {
  if (name.trim().length > 20) {
    toast.error("Invalid name", {
      description: "Name can't be more than 20 characters",
    });
    return false;
  }

  if (bio.trim().length > 100) {
    toast.error("Invalid bio", {
      description: "Bio can't be more than 100 characters",
    });
    return false;
  }

  if (job.trim().length > 20) {
    toast.error("Invalid job", {
      description: "Job can't be more than 20 characters",
    });
    return false;
  }

  return true;
}

/* -------------------- Image -------------------- */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImage(file: File | null): ImageValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        "Unsupported file type. Please upload a JPEG/PNG/WEBP/GIF/AVIF/SVG.",
    };
  }

  const maxSizeBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 5 MB.",
    };
  }

  return { valid: true };
}

/* -------------------- Password -------------------- */

export function validatePassWord(
  oldPassword: string,
  newPassword: string,
): boolean {
  if (!oldPassword) {
    toast.error("Old password is required");
    return false;
  }

  if (!newPassword) {
    toast.error("New password is required");
    return false;
  }

  if (oldPassword.length < 8 || newPassword.length < 8) {
    toast.error("Weak Password", {
      description: "Password must be at least 8 characters long.",
    });
    return false;
  }

  return true;
}

/* -------------------- Category -------------------- */

export function validateCatagoryName(name: string): boolean {
  if (!name) {
    toast.error("Category name is required");
    return false;
  }

  if (name.trim().length > 20) {
    toast.error("Category name can't be more than 20 characters.");
    return false;
  }

  toast.success("Category created successfully 📂");
  return true;
}
