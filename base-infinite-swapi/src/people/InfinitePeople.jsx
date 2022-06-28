import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error } = useInfiniteQuery(
    "sw-people", //queryKey
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), //queryFn
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined, //sw-api conveniently has a next prop
    },
  );

  // isFetching is an experiment to show its difference from isLoading (it hits this early return e reloads the page from the top)
  // Remember: isLoading === isFetching && cached data
  // if(isFetching) return <div className="loading">Loading...</div>;
  if(isLoading) return <div className="loading">Loading...</div>;
  if(isError) return <div>{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll 
        loadMore={fetchNextPage} 
        hasMore={hasNextPage}
      >
      {data.pages.map(pageData => {
        return pageData.results.map(person => {
          return (
          <Person 
            key={person.name}
            name={person.name}
            hairColor={person.hair_color}
            eyeColor={person.eye_color} 
          />
          )});
      })}
      </InfiniteScroll>
    </>);
}
