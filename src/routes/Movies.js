import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";

export default function Movies() {
  const client = useApolloClient();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    client
      .query({
        query: gql`
          {
            allMovies {
              title
            }
          }
        `,
      })
      .then((res) => setMovies(res.data.allMovies));
  }, []);

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
}
