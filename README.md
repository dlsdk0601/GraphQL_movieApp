# GraphQl Start

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
<br />
<br />
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