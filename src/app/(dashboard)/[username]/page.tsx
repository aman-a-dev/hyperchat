import { Suspense } from "react";
import UserProfileClient from "@/components/layout/user/user-profile-client";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">Loading profile...</div>
      }
    >
      <UserProfileClient username={username} />
    </Suspense>
  );
}
