import Link from "next/link";
import Footer from "@/components/layout/home/footer";
import Nav from "@/components/layout/home/nav";
import { Button } from "@/components/ui/button";
import { starborn } from "@/components/font/font";

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className={`${starborn.className} text-8xl md:text-9xl`}>404</h1>
        <p>This page is not found. </p>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
      <Footer />
    </>
  );
}
