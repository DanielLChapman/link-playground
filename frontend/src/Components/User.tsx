import { user } from "@/tools/lib";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useCallback, useEffect, useState } from "react";

export type backendtype = {
    data: user;
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
