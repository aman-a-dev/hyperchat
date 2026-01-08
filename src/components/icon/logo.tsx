import Image from "next/image";

export function Logo({ size = 50 }) {
  return <Image src="/icin/logo.png" alt="logo" width={size} height={"auto"} />;
}
