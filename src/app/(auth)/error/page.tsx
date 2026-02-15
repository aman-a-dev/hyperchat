import Link from "next/link";
import { Bitshow } from "@/components/font/font";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <TriangleAlertIcon className="size-15" />
      <h1 className={`${Bitshow.className} text-center text-5xl md:text-6xl`}>
        An Error Occurred
      </h1>
      <p className="text-center">
        Authentication Error occured please try to authenticat again
      </p>
      <div className="flex gap-3">
        <Link href="/auth/sign-up">
          <Button>Sign up</Button>
        </Link>
        <Link href="/auth/sign-in">
          <Button>Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
