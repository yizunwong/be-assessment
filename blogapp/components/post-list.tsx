import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, isLoading, hasMore }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Link
              href={{
                pathname: '/blogs/[id]',
                query: { id: post.id, title: post.title, content: post.content },
              }}
            >
              <h3 className="text-xl font-semibold text-blue-600 hover:underline mb-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-gray-700 text-sm">{post.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 my-4">Loading more posts...</p>
      )}

      {!hasMore && (
        <p className="text-center text-gray-500 my-4">No more posts to load.</p>
      )}
    </div>
  );
};

export default PostList;