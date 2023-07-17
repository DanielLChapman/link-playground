import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';

export const DELETE_SINGLE_LINK = gql`
    mutation DELETE_SINGLE_LINK($linkId: String!) {
        deleteShortenedLink(where: {
            id: $linkId
        }) {
            id
        }
    }
`

export const deleteLinkFunction = async (id, returnFunc) => {
    const [deleteLink, {data, error, loading}] = useMutation(DELETE_SINGLE_LINK, {
        variables: {
            id
        }
    });

    const res = await deleteLink();
    if (res.errors) {
        alert('Error');
    }
    if (res.data) {
        alert('success');
        returnFunc();
    }

}

const DeleteSingleLink: React.FC<{linkId: string}> = ({linkId: string}) => {
    return (
        <div>
            
        </div>
    );
}

export default DeleteSingleLink;