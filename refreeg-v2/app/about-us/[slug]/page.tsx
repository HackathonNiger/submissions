// app/blog/page.tsx
import { blogs } from "@/lib/blog"; // Adjust the path to your blogs array
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function BlogPage({
  params,
}: {
  params: { [key: string]: string };
}) {
  // Extract the slug from searchParams
  const slug = params.slug as string;

  // Find the blog with the matching title
  const blog = blogs.find((blog) => blog.slug === slug);

  // If the blog is not found, show a 404 message
  if (!blog) {
    notFound(); // Redirects to app/(home)/not-found.tsx automatically
  }

  return (
    <div className="w-full px-4 md:px-16 lg:px-32 py-12 bg-white">
      {/* Main Blog Content */}
      <section className="text-center">
        <h2 className="text-gray-700 text-sm uppercase tracking-widest mb-2">
          Why You Should Use Us
        </h2>
        <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
        <div className="w-full flex justify-center mb-6">
          <Image
            src={blog.img}
            alt={blog.title}
            width={700}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
        <p
          className="text-gray-600 max-w-2xl mx-auto mb-4 text-justify"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <Link
          href="https://t.me/+d67UCIer8c01ODhk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Join our community to track donations
          </button>
        </Link>
      </section>

      {/* Real-Time Tracking Section (Conditional Rendering) */}
      {blog.realTimeTracking && (
        <section className="mt-16 text-center">
          <h1 className="text-3xl font-bold mb-6">
            {blog.realTimeTracking.title}
          </h1>
          <div className="w-full flex justify-center mb-6">
            <Image
              src={blog.realTimeTracking.img}
              alt={blog.realTimeTracking.title}
              width={700}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
          <p
            className="text-gray-600 max-w-2xl mx-auto mb-4 text-justify"
            dangerouslySetInnerHTML={{ __html: blog.realTimeTracking.content }}
          />
        </section>
      )}
    </div>
  );
}
