import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { CURRENT_USER_QUERY } from "../User";
import { DELETE_ALL_LINKS_FROM_USER, DELETE_SOME_LINKS_FROM_USER, GET_SHORTENED_LINKS } from "../Tools/Queries";


export const useDeleteAllLinks = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(
        DELETE_ALL_LINKS_FROM_USER,
        {
            refetchQueries: [CURRENT_USER_QUERY],
        }
    );

    const deleteAllLinks = async () => {
        const res = await deleteLinkMutation();
        return res;
    };

    return { deleteAllLinks, data, error, loading };
};

export const useDeleteSomeLinks = () => {
    const [deleteLinkMutation, { data, error, loading }] = useMutation(
        DELETE_SOME_LINKS_FROM_USER,
        {
            refetchQueries: [CURRENT_USER_QUERY, GET_SHORTENED_LINKS],
        }
    );

    const deleteSomeLinks = async (ids: string[]) => {
      console.log(ids)
        let confirmation = confirm(
            "This can't be undone, are you sure you want to delete?"
        );
        if (confirmation) {
            const res = await deleteLinkMutation({
                variables: { shortenedLinks: ids },
            });
            return res;
        }
    };

    return { deleteSomeLinks, data, error, loading };
};
