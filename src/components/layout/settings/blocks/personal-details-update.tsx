"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Building, Earth, Smile } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface PersonalDetailsOperationProps {
  session: {
    user: {
      name: string;
      bio?: string | null;
      job?: string | null;
      country?: string | null;
    };
  };
  onSuccess?: () => void;
}

export function PersonalDetailsOperation({
  session,
  onSuccess,
}: PersonalDetailsOperationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session.user.name,
    bio: session.user.bio || "",
    job: session.user.job || "",
    country: session.user.country || "",
  });

  // ✅ Define handleChange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Build payload with only changed fields
    const payload: Record<string, string> = {};
    if (formData.name !== session.user.name) payload.name = formData.name;
    if (formData.bio !== (session.user.bio || "")) payload.bio = formData.bio;
    if (formData.job !== (session.user.job || "")) payload.job = formData.job;
    if (formData.country !== (session.user.country || ""))
      payload.country = formData.country;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user-data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Update failed");

      toast.success("Profile updated successfully");
      onSuccess?.();
    } catch (err) {
      toast.error("An Error Occurred", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 overflow-auto">
      <Field>
        <FieldLegend>Update your personal details</FieldLegend>

        <FieldLabel htmlFor="name">Name</FieldLabel>
        <div className="relative">
          <Input
            id="name"
            name="name"
            value={formData.name} // controlled component
            onChange={handleChange}
            placeholder={session.user.name || ""}
            className="peer ps-9 rounded-xl"
            disabled={isLoading}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Smile size={16} aria-hidden="true" />
          </div>
        </div>
        <FieldDescription>
          Your name to display at your profile.
        </FieldDescription>

        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder={session.user.bio || ""}
          className="rounded-xl"
          disabled={isLoading}
        />
        <FieldDescription>
          Describe yourself in just 100 words.
        </FieldDescription>

        <FieldLabel htmlFor="job">Job</FieldLabel>
        <div className="relative">
          <Input
            id="job"
            name="job"
            value={formData.job}
            onChange={handleChange}
            placeholder={session.user.job || ""}
            className="peer ps-9 rounded-xl"
            disabled={isLoading}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Building size={16} aria-hidden="true" />
          </div>
        </div>
        <FieldDescription>Your current job (optional)</FieldDescription>

        <FieldLabel htmlFor="country">Country</FieldLabel>
        <div className="relative">
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={session.user.country || ""}
            className="peer ps-9 rounded-xl"
            disabled={isLoading}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Earth size={16} aria-hidden="true" />
          </div>
        </div>
        <FieldDescription>
          Your current resident country name (optional)
        </FieldDescription>
        <hr />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : null}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Field>
    </form>
  );
}