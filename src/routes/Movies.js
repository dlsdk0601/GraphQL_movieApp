import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ALL_MOVIES } from "../fetch/Get";

export default function Movies() {
  // ======================================
  // useQuery 사용법

  const { data, loading, error } = useQuery(ALL_MOVIES);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Could not fecth</h1>;
  }

  // ======================================
  // useApolloClient 사용법
  // const client = useApolloClient();
  // const [movies, setMovies] = useState([]);

  // useEffect(() => {
  //   client
  //     .query({
  //       query: gql``,
  //     })
  //     .then((res) => setMovies(res.data.allMovies));
  // }, []);

  return (
    <ul>
      {data.allMovies.map((mv) => (
        <li key={mv.id}>{mv.title}</li>
      ))}
    </ul>
  );
}
