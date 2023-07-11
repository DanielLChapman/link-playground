import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const GET_SHORTENED_URL = gql`
    query GetURL($shortURL: String!, $privatePass: String) {
        getURL(
            urlID: $shortURL,
            privatePass: $privatePass
        ) {
            originalURL
        }
    } 
`;

function ShortenedUrl(props) {
    const router = useRouter()
    const {data, error, loading} = useQuery(GET_SHORTENED_URL, {
        variables: {
            shortURL: router.query.urlID,
            privatePass: router.query.privatePass,
        }
    });

    if (error) {
        //fill out more 
        return <span>{error.message}</span>
    }

    if (loading) {
        //fill out more
        return <span>Loading...</span>
    }


    useEffect(() => {
        if (data && data.getURL) {
            window.location.href = data.getURL.originalURL;
        }
    }, [data]);


    return null;
}

export default ShortenedUrl;