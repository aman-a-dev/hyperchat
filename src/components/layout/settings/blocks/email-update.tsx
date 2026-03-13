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
import { Mail } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { validateEmail } from "@/actions/validation";
import { changeEmailAction } from "@/actions/user";

interface EmailOperationProps {
  session: {
    user: {
      email: string;
    };
  };
}

export function EmailOperation({ session }: EmailOperationProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (email === session.user.email) {
      toast.info("This is already your current email");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changeEmailAction(email);

      if (result.success) {
        toast.success("Verification email sent");
        setEmail("");
      } else {
        toast.error(result.error);
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
    <form onSubmit={handleSubmit} className="p-5">
      <Field>
        <FieldLegend>Update your Email</FieldLegend>

        <FieldLabel htmlFor="email">New Email</FieldLabel>

        <div className="relative">
          <Input
            required
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={session.user.email}
            className="peer ps-9 rounded-xl"
            disabled={isLoading}
          />

          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Mail size={16} />
          </div>
        </div>

        <FieldDescription>
          Enter a new email for your hyper-chat account. A verification email
          will be sent.
        </FieldDescription>

        <hr />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2" />}
          {isLoading ? "Sending..." : "Update Email"}
        </Button>
      </Field>
    </form>
  );
}
