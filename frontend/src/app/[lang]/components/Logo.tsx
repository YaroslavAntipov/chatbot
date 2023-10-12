import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
  href = "/",
}: {
  src: string | null;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label="Back to homepage"
      className="flex items-center p-2"
    >
      {src && <Image src={src} alt="logo" width={45} height={45} />}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
