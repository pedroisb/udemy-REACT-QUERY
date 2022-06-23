import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // we'll use useEffect to call queryClient.prefetch(); it's a way to ensure that it will be called only and when currentPage changes
  useEffect(() => {
    // constraint needed to make sure that there will be data to prefetch
    if(currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      // prefetch queryKey will need to have the same shape as the one in useQuery, since this is where react query will look to see if there's already data in cache
      queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient]);

  // isLoading vs isFetching: isFetching is true when the async func that fetches data hasn't resolved yet, whereas isLoading is true when isFetching is true + there is no data in cache
  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage], 
    () => fetchPosts(currentPage), 
    {
      // time before data becomes stale, in miliseconds (data being stale is one of the conditions that triggers fetch)
      staleTime: 2000,
      // keep past data in cache
      keepPreviousData: true,
    });
  
    if (isLoading) return <h3>Loading...</h3>;
  
    if (isError) 
    
    return (
      <>
        <h3>Something went wrong!</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1} 
          onClick={() => {
            setCurrentPage((prevState) => prevState - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= 10}
          onClick={() => {
            setCurrentPage((prevState) => prevState + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
