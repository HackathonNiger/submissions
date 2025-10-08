// components/logo.tsx
import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <div className="">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.svg" alt="logo" width={52} height={52} />
      </Link>
    </div>
  );
}
