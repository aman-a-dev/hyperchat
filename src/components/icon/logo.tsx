import Image from "next/image";

export function Logo({ size = 50 }: { size?: number }) {
  return (
    <Image src="/icon/favicon.png" alt="logo" width={size} height={size} />
  );
}
