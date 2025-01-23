import { useState } from "react";
import { getSession } from "next-auth/react";
import { User } from "../models/user";
import Layout from "@/components/layout";
import BlogList from "@/components/blog-list";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { Blog } from "@/payload-types";

interface MyBlogsProps {
  initialBlogs: Blog[]; // Renamed to initialBlogs for clarity
}

const MyBlogs: React.FC<MyBlogsProps> = ({ initialBlogs }) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialBlogs.length > 0); // Ensure hasMore is false if no initial blogs

  const fetchMoreBlogs = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const session = await getSession();
      const author = session?.user as User;

      const response = await fetch(
        `http://localhost:3000/api/blogs?where[author][equals]=${author._id}&page=${page}&populate=author`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setHasMore(false); // No more blogs to fetch
      } else {
        setBlogs((prevBlogs) => {
          const existingIds = new Set(prevBlogs.map((blog) => blog.id)); // Track existing blog IDs
          const newBlogs = data.docs.filter(
            (blog: any) => !existingIds.has(blog.id)
          ); // Filter out duplicates
          return [...prevBlogs, ...newBlogs];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="My Blogs">
      {blogs.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500 my-4">No blogs to display.</p>
      ) : (
        <InfiniteScroll
          dataLength={blogs.length}
          next={fetchMoreBlogs}
          hasMore={hasMore}
          loader={
            isLoading && (
              <div className="flex justify-center my-4">
                <CircularProgress color="primary" />
              </div>
            )
          }
          endMessage={
            <p className="text-center text-gray-500 my-4">
              No more blogs to load.
            </p>
          }
          scrollThreshold={0.8} // Trigger fetch when user scrolls 80% down
        >
          <BlogList blogs={blogs} />
        </InfiniteScroll>
      )}
    </Layout>
  );
};

export default MyBlogs;

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context);

    if (session) {
      const author = session.user as User;

      // Fetch the first page of blogs for the specific user
      const initialPage = 1;
      const response = await fetch(
        `http://localhost:3000/api/blogs?where[author][equals]=${author._id}&page=${initialPage}&populate=author`
      );
      const data = await response.json();

      const initialBlogs = data.docs.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
      }));
      return {
        props: { initialBlogs, initialPage },
      };
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: { initialBlogs: [], initialPage: 1 }, // Handle errors gracefully
    };
  }
}
