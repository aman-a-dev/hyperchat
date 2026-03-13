"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { PwInput } from "@/components/ui/pw-input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { validatePassWord } from "@/actions/validation";
import { updatePasswordAction } from "@/actions/user";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
}

export function PasswordOperation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validatePassWord(
      formData.currentPassword,
      formData.newPassword,
    );

    if (!isValid) {
      toast.error("Password does not meet requirements", {
        description:
          "Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
      });
      return;
    }

    setIsLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("current-password", formData.currentPassword);
    formDataObj.append("new-password", formData.newPassword);

    try {
      const result = await updatePasswordAction(formDataObj);

      if (result.success) {
        toast.success("Password updated successfully");

        setFormData({
          currentPassword: "",
          newPassword: "",
        });
      } else {
        toast.error("Update Failed", {
          description: result.error,
        });
      }
    } catch (err) {
      toast.error("An Error Occurred", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 overflow-scroll">
      <Field>
        <FieldLegend className="mt-5">Update your Password</FieldLegend>

        <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>

        <div className="relative">
          <Input
            required
            name="currentPassword"
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="********"
            className="peer ps-9 rounded-xl"
            disabled={isLoading}
          />

          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Lock size={16} />
          </div>
        </div>

        <FieldDescription>Your current password</FieldDescription>

        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>

        <PwInput
          name="newPassword"
          id="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="********"
          disabled={isLoading}
        />

        <FieldDescription>
          Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol
        </FieldDescription>

        <hr />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2" />}
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </Field>
    </form>
  );
}
