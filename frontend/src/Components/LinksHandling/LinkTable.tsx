import React, { useState } from "react";
import { UserOnlyProps } from "../Header";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { shortenedLinks } from "../../../tools/lib";
import PrivatePassInput from "./PrivatePassInput";

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

const LinkTable: React.FC<UserOnlyProps> = ({ user }) => {
    if (!user) {
        return (
            <span>
                Nothing To See Here. Maybe try logging in, or waiting for it to
                load!
            </span>
        );
    }

    const [linkPage, setLinkPage] = useState(1);
    const [linkItemsPerPage, setLinkItemsPerPage] = useState(10);

    const { data, error, loading } = useQuery(GET_SHORTENED_LINKS, {
        variables: {
            userID: user.id,
            limit: linkItemsPerPage,
            offset: (linkPage - 1) * linkItemsPerPage,
        },
    });

    let links = [] as shortenedLinks[];
    if (loading || error) {
        links = [];
    } else {
        links = data.shortenedLinks;
    }

    const baseURL = typeof window !== "undefined" ? window.location.origin : "";

    const getUrl = (shortened, isPrivate, privatePass) => {
        let url = `${baseURL}/${shortened}`;
        if (isPrivate && privatePass) {
            url += `/${privatePass}`;
        }
        return url;
    };

    const handleCopy = async (shortened, isPrivate, privatePass) => {
        await navigator.clipboard.writeText(
            getUrl(shortened, isPrivate, privatePass)
        );
        alert("Copied To Clipboard");
    };

    const [updateLinkPrivacy] = useMutation(UPDATE_LINK);

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden overflow-y-auto max-h-[400px]">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4">
                                        Original URL
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Shortened URL
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Clicks
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Delete
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Private
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Private Password
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.map((x) => (
                                    <tr
                                        key={x.id}
                                        className="border-b dark:border-neutral-500"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                                            <a href={x.originalURL}>
                                                {x.originalURL}
                                            </a>
                                        </td>
                                        <td
                                            className="whitespace-nowrap px-6 py-4"
                                            onClick={() => {
                                                handleCopy(
                                                    x.shortenedURL,
                                                    x.isPrivate,
                                                    x.privatePass
                                                );
                                            }}
                                        >
                                            <span className="sm:hidden md:hidden lg:block cursor-pointer">
                                                Click To
                                            </span>{" "}
                                            <span>Copy</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {x.clicks}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            X
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={x.isPrivate}
                                                onChange={() =>
                                                    updateLinkPrivacy({
                                                        variables: {
                                                            id: x.id,
                                                            isPrivate:
                                                                !x.isPrivate,
                                                        },
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            {x.isPrivate && (
                                                <PrivatePassInput
                                                    initialPass={x.privatePass}
                                                    id={x.id}
                                                    
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="ml-4">
                            <button
                                aria-disabled={linkPage === 1}
                                disabled={linkPage === 1}
                                onClick={() => setLinkPage(linkPage - 1)}
                                data-testid="link-pagination-prev"
                                className="disabled:opacity-50 w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                            >
                                Previous
                            </button>
                            <button
                                disabled={links.length < linkItemsPerPage}
                                aria-disabled={links.length < linkItemsPerPage}
                                onClick={() => setLinkPage(linkPage + 1)}
                                data-testid="stock-pagination-next"
                                className="disabled:opacity-50 w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkTable;
