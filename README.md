# GraphQL Start

> GraphQL API 섹션을 복습 차원에서 다시 정리 했으니, client도 다시 복습 합니다.

<br />

# New

<br />

### install

<br />

> Client단에서 GraphQL을 사용하기 위해서 해당 라이브러리를 다운 받아야한다. @apollo/client와 graphql을 필요로 한다.

<br />

```
    npm i @apollo/client graphql
```

<br />

### Provider

<br />

index.js에서 App.js를 ApolloProvider로 감싸준다. Provider로 감싸는 이유는 children 컴포넌트에서 Apollo로 접근 할 수 있게 하기 위해서 입니다.

<br />

### client

<br />

client를 정의 해줘야한다. ApolloClient를 이용해 uri와 cache 설정을 해준다.
Axios를 빗대어 설명하자면, Axios.create를 이용해 baseURL과 headers 등을 설정 해주는것과 비슷하다.

<br />

```
    import { ApolloClient, InMemoryCache } from "@apollo/client";

    const client = new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
    });
```

<br />

포트 번호 4000은 GraphQL API를 만들었던 작업물이 4000번으로 돌아가서 설정했다.

<br />

### useApolloClient

<br />

GraphQL로 데이터를 받아오기 위해서 useApolloClient를 사용한다.
query 함수를 사용하여, GraphQL 쿼리문을 작성하면 해당 데이터를 불러온다.

<br />

```
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
```

<br />

### Local only field (client only field)

<br />

Apollo 클라이언트 쿼리에는 GraphQL 서버의 스키마에 정의되지 않은 로컬 전용 필드가 포함될 수 있습니다.
@client 지시문은 isLiked가 로컬 전용 필드임을 Apollo Client에 알립니다.
isLiked는 로컬 전용이므로 Apollo Client는 name과 값을 가져오기 위해 서버에 보내는 쿼리에서 이를 생략합니다.
최종 쿼리 결과는 모든 로컬 및 원격 필드가 채워진 후에 반환됩니다.

```
    const onClick = () => {
        // apollo client도 서버에서 데이터를 받아오면 캐시에 저장하게 되는데
        // client onluy field 이기에 캐시에 저장된 정보에 접근하여 저장함.
        // MovieFragment라는 키값에 저장함 fragment형식은 저대로 지켜줘야한다.
        //즉, MovieFragment 외에는 지켜야할 형식

        cache.writeFragment({
        id: `Movie:${movieId}`,
        // : 다음에 띄워쓰기 했다가 필드에 저장이 안되는 이슈가 발생했었다

        fragment: gql`
            fragment MovieFragment on Movie {
            isLiked
            }
        `,
        data: {
            isLiked: !data.movie.isLiked,
        },
        });
    };
```

<br />

# Old Version

> GraphQL이란? 페이스북에서 만든 쿼리 언어
> <br />지금까지 접해왔던 SQL과는 다른 쿼리 언어이다

<br /><br />

1. setUp

```
    npm install apollo-boost @apollo/react-hooks
```

<br />

> 현재는 업데이트 된 버전으로 두가지가 하나로 통합 되었다.

```
    npm install  @apollo/client graphql
```

<br />

> index.js에서 Provider로 감싸준다.

<br />
index.js

```
    import client from "./apollo";
    import {ApolloProvider} from "@apollo/react-hooks";

    ReactDOM.render(
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>, document.getElementById('root')
    );
```

<br />

> apollo.js 파일을 만들어 가져올 api 주소 셋팅

<br />
apollo.js

```
    import ApolloClient from 'apollo-boost';

    const client = new ApolloClient({
        uri: "https://movieql2.vercel.app/",
        resolvers:{
            Movie: {
                isLiked: () => false
            },
            Mutation: {
                toggleLikeMovie: (_, { id, isLiked}, {cache}) => {
                        cache.writeData({
                            id: `Movie:${id}`,
                            data: {
                            isLiked: !isLiked
                            }
                        })
                },
            }
        }
    })

    export default client;
```

<br />

2. Query 문 응용

> apollo-boost와 @apollo/react-hooks을 통해 각각 gql과 useQuery를 import
> <br /> > <br />
> GET_MOVIES 라는 변수에 gql을 써서 가져오고 싶은 data 설정

<br />

Home.js

```
    import {gql} from "apollo-boost";
    import {useQuery} from "@apollo/react-hooks";

    const GET_MOVIES = gql`{
        movies {
            id
            medium_cover_image
            isLiked @client
        }
    }`
```

<br />

> gql은 Home 컴포넌트 밖에서 설정 해준다

```
    const Home = () => {

        const { loading, error, data } = useQuery(GET_MOVIES);

        return (
            <Container>
                <Header>
                    <Title>Apollo 2020</Title>
                    <Subtitle>I love GraphQL</Subtitle>
                </Header>
                {(!loading && data.movies) && (
                        <Movies>
                        {
                            data?.movies?.map(m => (
                                <Movie
                                key={m.id}
                                isLiked={m.isLiked}
                                id={m.id}
                                bg={m.medium_cover_image}
                                />
                            ))
                        }
                        </Movies>
                    )}
            </Container>
        )
    }
```

<br />
<br />

3. 장점

> 프론트단에서 큰 장점은 프론트단에서 api 통신 할 경우, 필요한 컬럼값을 백단에 요청하는게 아닌 프론트단에서 추가 가능

<br />

Movie.js

```
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
```

<br />

> isLiked @client 이건 원래 api에 없는 컬럼인데, 프론트단이 추가해주고 싶은 값이라서 추가 해준거임

```
    const Movie = ( {id, bg, isLiked} ) => {

    const [toggleMovie] = useMutation(LIKE_MOVIE, {variables: { id: parseInt(id), isLiked } })
    useQuery(GET_MOVIE, { variables: { id: +id } });

        return (
            <Container>
                <Link to={`/${id}`}>
                    <Poster bg={bg} />
                    <p onClick={toggleMovie}>{isLiked ? "Unlike" : "Like"}</p>
                </Link>

            </Container>
        );
    }
```
