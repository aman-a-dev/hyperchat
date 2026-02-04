import Image from "next/image";

export function Logo({ size = 50 }) {
  return (
    <Image src="/icon/favicon.png" alt="logo" width={size} height={"auto"} />
  );
}
