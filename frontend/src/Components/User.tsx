import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useCallback, useEffect, useState } from "react";
import { User } from "../../tools/lib";

export type backendtype = {
    data: User;
};

export const CURRENT_USER_QUERY = gql`
    query {
        authenticatedItem {
            ... on User {
                id
                username
                email
                links {
                    id
                    originalURL
                    shortenedURL
                    isPrivate
                    privatePass
                    clicks
                    createdAt
                }
                createdAt

            }
        }
    }
`;



export function useUser() {
    let { data } = useQuery(CURRENT_USER_QUERY);

    return data?.authenticatedItem;
}
