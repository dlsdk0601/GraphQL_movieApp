import { gql } from "@apollo/client";

export const ALL_MOVIES = gql`
  query getMovies {
    allMovies {
      title
    }
  }
`;
