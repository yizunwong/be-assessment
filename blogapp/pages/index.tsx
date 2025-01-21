import Layout from '@/components/layout';
import PostList from '@/components/post-list';
import { useState, useEffect, useRef } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface MyPostsProps {
  initialPosts: Post[];
}

const MyPosts: React.FC<MyPostsProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/blogs?page=${page}`);
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false); // No more posts to fetch
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 } // Trigger when the target is fully visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [page, hasMore]);

  return (
    <Layout title="Popular Posts">
      <PostList posts={posts} isLoading={isLoading} hasMore={hasMore} />
      <div ref={observerTarget}></div> {/* Observer target */}
    </Layout>
  );
};

export default MyPosts;

export async function getServerSideProps() {
  try {
    // Fetch the first page of data
    const response = await fetch('http://localhost:3000/api/blogs?page=1');
    const data = await response.json();

    const initialPosts = data.map((post: any) => ({
      id: post._id,
      title: post.title,
      content: post.content,
    }));

    return {
      props: { initialPosts },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: { initialPosts: [] }, // Handle errors gracefully
    };
  }
}