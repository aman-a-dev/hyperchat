"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Logo, GoogleIcon } from "@/components/icon/icons";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { validateSignIn } from "@/actions/validation";

export default function SignIn() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const router = useRouter();
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const { data: session } = authClient.useSession();
  useEffect(() => {
    if (session) {
      router.push("/chats");
    }
  }, [session, router]); // Added dependencies

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Validate sign-in data
      const isValid = await validateSignIn(email, password);

      if (isValid) {
        // Sign in with email
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onRequest: () => {
              setLoading(true);
            },
            onSuccess: () => {
              router.push("/chats");
              toast.success("You have signed in successfully");
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error("Sign in failed", {
                description: ctx.error.message || "Invalid email or password",
              });
            },
          },
        );
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An error occurred", {
        description: "Please try again",
      });
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chats",
        errorCallbackURL: "/auth/error",
        //storeAccessToken: false
      });

      if (res.error) {
        toast.error("Google sign-in failed", {
          description: res.error.message || "Please try again",
        });
        setGoogleLoading(false);
        return;
      }

      // If successful, auth flow will handle the redirect
      // No need for manual redirect here
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Sign-in failed", {
        description: "Please try again",
      });
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
        <SignInHeader />
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full justify-center gap-2 rounded-xl"
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <GoogleIcon className="h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              or sign in with email
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-6">
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

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/password-reset"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-2.5">
                <Input
                  required
                  id="password"
                  className="ps-9 pe-9 rounded-xl bg-background"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  disabled={loading || googleLoading}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  disabled={loading || googleLoading}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button
            className="w-full rounded-xl"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <span>Signing in...</span>
                <Spinner />
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <SignInFooter />
        </form>
      </div>
    </motion.div>
  );
}

function SignInHeader() {
  return (
    <div className="space-y-2 text-center flex justify-between items-center flex-col">
      <Link href="/">
        <Logo />
      </Link>
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="text-muted-foreground">
        Sign in to access to your dashboard, settings and others.
      </p>
    </div>
  );
}

function SignInFooter() {
  return (
    <div className="text-center text-sm">
      No account?{" "}
      <Link
        href="/sign-up"
        className="text-primary font-medium hover:underline"
      >
        Create an account
      </Link>
    </div>
  );
}
