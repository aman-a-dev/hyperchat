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
export function validateImageType(type) {
  if (type) {
    toast.error("Invalid Image", {
      description: "Try to upload image with png,gif,svg extensions.",
    });
    return false;
  }

  return true;
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
