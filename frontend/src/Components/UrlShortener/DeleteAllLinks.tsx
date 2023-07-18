import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from '../User';
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
        deleteSelectLinks(shortenedLinks: $shortenedLinks) {
            success
            message
            failedDeletions
        }
    }
`;

export const useDeleteAllLinks = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(DELETE_ALL_LINKS_FROM_USER, {
      refetchQueries: [CURRENT_USER_QUERY]
    });
  
    const deleteAllLinks = async () => {
      const res = await deleteLinkMutation();
      return res;
    };
  
    return { deleteAllLinks, data, error, loading };
};

export const useDeleteSomeLinks = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(DELETE_SOME_LINKS_FROM_USER, {
      refetchQueries: [CURRENT_USER_QUERY]
    });
  
    const deleteSomeLinks = async (ids: string[]) => {
      const res = await deleteLinkMutation({ variables: { shortenedLinks: ids } });
      return res;
    };
  
    return { deleteSomeLinks, data, error, loading };
};
