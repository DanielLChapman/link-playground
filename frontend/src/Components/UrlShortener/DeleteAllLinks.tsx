import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from '../User';

export const DELETE_SINGLE_LINK = gql`
    mutation DELETE_SINGLE_LINK($linkId: String!) {
        deleteShortenedLink(where: {
            id: $linkId
        }) {
            id
        }
    }
`


export const useDeleteLink = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(DELETE_SINGLE_LINK, {
      refetchQueries: [CURRENT_USER_QUERY]
    });
  
    const deleteLink = async (id) => {
      const res = await deleteLinkMutation({ variables: { id } });
      return res;
    }
  
    return { deleteLink, data, error, loading };
}