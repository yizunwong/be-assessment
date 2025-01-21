// import { useState, useEffect } from 'react';
// import { getSession } from 'next-auth/react';
// import { User } from './models/user';
// import Layout from '@/components/layout';
// import PostList from '@/components/post-list';
// interface Post {
//   id: string;
//   title: string;
//   content: string;
// }

// interface MyPostsProps {
//   posts: Post[];
// }

// const MyPosts: React.FC<MyPostsProps> = ({ posts: initialPosts }) => {
//   const [posts, setPosts] = useState<Post[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setPosts(initialPosts);
//       setIsLoading(false);
//     }, 500);
//   }, [initialPosts]);

//   return (
//     <Layout title="My Posts">
//       <PostList posts={posts} isLoading={isLoading} />
//     </Layout>
//   );
// };

// export default MyPosts;


// export async function getServerSideProps(context: any) {
//   try {
//     const session = await getSession(context);

//     if (!session) {
//       return {
//         redirect: {
//           destination: '/auth/signin',
//           permanent: false,
//         },
//       };
//     }
//     const author = session.user as User;

//     // Fetch posts for the specific user
//     const response = await fetch(`http://localhost:3000/api/blogs?authorId=${author!._id}`);
//     const data = await response.json();

//     const posts = data.map((post: any) => ({
//       id: post._id,
//       title: post.title,
//       content: post.content,
//     }));

//     return {
//       props: { posts },
//     };
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return {
//       props: { posts: [] }, 
//     };
//   }
// }
