import { gql } from "@apollo/client";

export const ALL_MOVIES = gql`
  query getMovies {
    allMovies {
      title
      id
      medium_cover_image
    }
  }
`;

export const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      medium_cover_image
      rating
    }
  }
`;
