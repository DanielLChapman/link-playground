import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from '../User';
import { GET_SHORTENED_LINKS } from '../LinksHandling/LinkTable';

export const DELETE_SINGLE_LINK = gql`
    mutation DELETE_SINGLE_LINK($linkId: ID!) {
        deleteShortenedLink(where: {
            id: $linkId
        }) {
            id
        }
    }
`


export const useDeleteLink = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(DELETE_SINGLE_LINK, {
        update(cache, { data: { deleteShortenedLink } }) {
            cache.modify({
                fields: {
                    shortenedLinks(existingLinks = [], { readField }) {
                        return existingLinks.filter(
                            linkRef => deleteShortenedLink.id !== readField('id', linkRef)
                        );
                    },
                },
            });
        },
    });
  
    const deleteLink = async (id) => {
        let confirmation = confirm("This can't be undone, are you sure you want to delete?")
        if (confirmation) {
            const res = await deleteLinkMutation({ variables: { linkId: id } });
            return res;
        }
    }
  
    return { deleteLink, data, error, loading };
}