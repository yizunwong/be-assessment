import { Blog } from "@/payload-types";
import Link from "next/link";

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => {
          const authorName =
            typeof blog.author === "string" ? "Unknown Author" : blog.author.username;

          const authorInitial =
            typeof blog.author === "string"
              ? "U"
              : blog.author.username.charAt(0).toUpperCase();

          return (
            <div
              key={blog.id}
              className="relative bg-cover bg-center h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link
                href={{
                  pathname: "/blogs/[id]",
                  query: {
                    id: blog.id,
                  },
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200 mb-3">
                    {blog.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {authorInitial}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">By {authorName}</p>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200">
                    Read More →
                  </button>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;