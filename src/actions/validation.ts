import { toast } from "sonner";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export function validateSignUp(name, email, password) {
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

export function validateSignIn(email, password) {
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

export function validateChangeUserData(name, bio, job, _country) {
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
      description: "job can't be more than 20 characters",
    });
    return false;
  }

  if (!validateEmail(email)) {
    toast.error("Invalid Email", {
      description: "Please enter a valid email format.",
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
export function validateImage(file) {
  if (!file) return { valid: false, error: "No file selected." };

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
  ];
  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error:
        "Unsupported file type. Please upload a JPEG/PNG/WEBP/GIF/AVIF/SVG.",
    };
  }

  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 5 MB.",
    };
  }

  return { valid: true };
}
export function validatePassWord(oldPassword, newPassword) {
  if (!oldPassword) {
    toast.error("Old password is required");
    return false;
  }
  if (!newPassword) {
    toast.error("New password is required");
    return false;
  }
  if (oldPassword.length < 8 && newPassword.length < 8) {
    toast.error("Weak Password", {
      description: "Password must be at least 8 characters long.",
    });
    return false;
  }

  return true;
}
export function validateCatagoryName(name) {
  if (!name) {
    toast.error("Catagory name is required");
    return false;
  }
  if (name.trim().length > 20) {
    toast.error("Catagory name length can't be more than 20 characters. ");
    return false;
  }
  toast.success("Catagory Created successfully 📂");
  return true;
}
