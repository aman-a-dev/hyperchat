"use client";

import Link from "next/link";
import { ArrowRight, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Logo, GoogleIcon } from "@/components/icon/icons";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PwInput } from "@/components/ui/pw-input";
import { validateSignUp } from "@/actions/validation";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/chats");
    }
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Get password from form - assuming PwInput has a name attribute of "password"
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Validate signup data
      const isValid = await validateSignUp(name, email, password);

      if (isValid) {
        setLoading(false);

        // Sign up with email
        await authClient.signUp.email(
          {
            name,
            email,
            password,
            callbackURL: "/chats",
          },
          {
            onRequest: () => {
              setLoading(true);
            },
            onSuccess: () => {
              setLoading(false);
              toast.success("Account created successfully!");
              router.push("/chars");
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error("Sign up failed", {
                description:
                  ctx.error.message || "An Error Occurred try it again.",
              });
            },
          },
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);

      const { _, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chats",
        errorCallbackURL: "/error",
      });

      if (error) {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed", {
          description: error.message || "Please try again",
        });
        return;
      }

      // If successful, the user will be redirected by the auth provider
      // No need to manually redirect here
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Sign-in failed", {
        description: "Please try again",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center min-h-screen"
    >
      <div className="mx-auto w-full max-w-lg space-y-6 p-4 md:shadow-xl md:p-10 md:rounded-xl">
        <SignupHeader />
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 rounded-xl"
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <GoogleIcon className="h-4 w-4" />
                Sign Up with Google
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              or sign up with email
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative mt-2.5">
                <Input
                  required
                  id="name"
                  className="peer ps-9 rounded-xl bg-background"
                  placeholder="John Doe"
                  type="text"
                  name="name"
                  disabled={loading || googleLoading}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <User size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2.5">
                <Input
                  required
                  id="email"
                  className="peer ps-9 rounded-xl bg-background"
                  placeholder="demo@gmail.com"
                  type="email"
                  name="email"
                  disabled={loading || googleLoading}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <PwInput disabled={loading || googleLoading} />
          </div>

          <Button
            className="w-full rounded-xl"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <span>Creating...</span>
                <Spinner />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <SignupFooter />
        </form>
      </div>
    </motion.div>
  );
}

function SignupHeader() {
  return (
    <div className="space-y-2 text-center flex justify-between items-center flex-col">
      <Link href="/">
        <Logo />
      </Link>
      <h1 className="text-3xl font-semibold">Create Account</h1>
      <p className="text-muted-foreground">
        Signup to create new hyper-chat account.
      </p>
    </div>
  );
}

function SignupFooter() {
  return (
    <div className="text-center text-sm">
      You have an account?{" "}
      <Link
        href="/sign-in"
        className="text-primary font-medium hover:underline"
      >
        Sign in
      </Link>
    </div>
  );
}
