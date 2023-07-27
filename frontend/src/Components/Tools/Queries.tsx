import gql from "graphql-tag";

// Queries
export const GET_SHORTENED_LINKS = gql`
    query GET_SHORTENED_LINKS($userID: ID!, $limit: Int!, $offset: Int!) {
        shortenedLinks(
            where: { owner: { id: { equals: $userID } } }
            skip: $offset
            take: $limit
            orderBy: { createdAt: desc }
        ) {
            id
            originalURL
            shortenedURL
            isPrivate
            privatePass
            clicks
            createdAt
        }
    }
`;

// Mutations
export const CREATE_LINK = gql`
    mutation CreateShortenedLink(
        $originalURL: String!
        $isPrivate: Boolean
        $privatePass: String
    ) {
        generateShortenedURL(
            url: $originalURL
            isPrivate: $isPrivate
            privatePass: $privatePass
        ) {
            id
            originalURL
            shortenedURL
            isPrivate
            privatePass
            clicks
            createdAt
        }
    }
`;

export const DELETE_ALL_LINKS_FROM_USER = gql`
    mutation {
        deleteAllLinks {
            success
            message
            failedDeletions
        }
    }
`;

export const DELETE_SOME_LINKS_FROM_USER = gql`
    mutation DELETE_SOME_LINKS_FROM_USER($shortenedLinks: [String!]!) {
        deleteSelectLinks(shortenedURLs: $shortenedLinks) {
            success
            message
            failedDeletions
        }
    }
`;

export const DELETE_SINGLE_LINK = gql`
    mutation DELETE_SINGLE_LINK($linkId: ID!) {
        deleteShortenedLink(where: {
            id: $linkId
        }) {
            id
        }
    }
`

export const UPDATE_LINK = gql`
    mutation UpdateLink($id: ID!, $isPrivate: Boolean, $privatePass: String) {
        updateShortenedLink(
            where: { id: $id }
            data: { isPrivate: $isPrivate, privatePass: $privatePass }
        ) {
            id
            isPrivate
            privatePass
        }
    }
`;
