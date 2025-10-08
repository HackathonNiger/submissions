"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-white px-4 text-center pb-20">
      <div className="max-w-lg">
        <Image
          src="/404-illustration.svg"
          alt="404 Illustration"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mt-2 mb-6">
          Looks like you took a wrong turn, but do not worry—we are here to
          guide you back!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Go back
          </button>
          <Link href="/">
            <span className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center">
              Explore causes
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
