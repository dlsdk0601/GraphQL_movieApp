import { useMutation } from '@apollo/client';
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";

const LIKE_MOVIE = gql`
  mutation toggleLikeMovie($id: Int!, $isLiked: Boolean!){
    toggleLikeMovie(id: $id, isLiked: $isLiked) @client
  }
`

const GET_MOVIE = gql`
    query getMovie($id: Int!){
        movie(id: $id){
            title
            medium_cover_image 
            language
            rating
            description_intro
            isLiked @client
        }
        suggestions( id:$id){
          id
          medium_cover_image
        }
    }
`

const Movie = ( {id, bg, isLiked} ) => {

  const [toggleMovie] = useMutation(LIKE_MOVIE, {variables: { id: parseInt(id), isLiked } })
  useQuery(GET_MOVIE, { variables: { id: +id } });

    return (
        <Container>
            <Link to={`/${id}`}>
                <Poster bg={bg} />
            </Link>
            <p style={{cursor: "pointer"}} onClick={toggleMovie}>{isLiked ? "Unlike" : "Like"}</p>
            
        </Container>
    );
}

export default Movie;

const Container = styled.div`
  height: 380px;
  width: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  overflow: hidden;
  border-radius: 7px;
`;

const Poster = styled.div`
  background-image: url(${props => props.bg});
  height: 90%;
  width: 100%;
  background-size: cover;
  background-position: center center;
`;