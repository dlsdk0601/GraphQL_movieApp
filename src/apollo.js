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