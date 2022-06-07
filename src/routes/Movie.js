import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { GET_MOVIE } from "../fetch/Get";

export default function Movie() {
  const { id: movieId } = useParams();
  const { data, loading } = useQuery(GET_MOVIE, {
    variables: {
      movieId,
    },
  });

  console.log("data===");
  console.log(data, loading);

  if (loading) {
    return <h1>Fetching Movie...</h1>;
  }

  return <div>{data.movie.title}</div>;
}
