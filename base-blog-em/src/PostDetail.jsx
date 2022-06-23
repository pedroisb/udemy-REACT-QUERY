import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(["comments", post.id], () => fetchComments(post.id));

  // Unlike the query fn, the mutation fn can take args
  const deleteMutation = useMutation((postId) => deletePost(postId));
  // it could've been just () => delete(post.id), since the id is coming from props

  // in a real scenario it would also take the new post title as an arg
  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isLoading) return <h3>Loading comments...</h3>;

  if (isError) return <h3>{error.toString()}</h3>

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete
      </button>
      {deleteMutation.isError && (
        <p style={{color: 'red'}}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{color: 'purple'}}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        // jsonplaceholderAPI does not allow us to actually alter server data
        <p style={{color: 'green'}}>Success: Post has (not) been deleted!</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{color: 'red'}}>Error: Mutation failed!</p>
      )}
      {updateMutation.isLoading && (
        <p style={{color: 'purple'}}>Mutation in progress...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{color: 'green'}}>Success: Post has (not) been updated</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
