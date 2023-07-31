import React, { useEffect, useState } from "react";
import { UserOnlyProps } from "../Header";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { shortenedLinks } from "../../../tools/lib";
import PrivatePassInput from "./PrivatePassInput";
import { useDeleteLink } from "../UrlShortener/DeleteSingleLink";
import SuccessMessaging from "../Tools/SuccessMessaging";
import { useDeleteSomeLinks } from "../UrlShortener/DeleteAllLinks";
import { handleCopy } from "../Tools/HandleCopy";
import { GET_SHORTENED_LINKS, UPDATE_LINK } from "../Tools/Queries";
import NameInput from "./NameInput";

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
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

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

    const [updateLinkPrivacy] = useMutation(UPDATE_LINK);

    const {
        deleteLink,
        data: deletedata,
        error: deleteerror,
        loading: deleteloading,
    } = useDeleteLink();

    const {
        deleteSomeLinks,
        data: deletesomedata,
        error: detelesomeerror,
        loading: deletesomeloading,
    } = useDeleteSomeLinks();

    useEffect(() => {
        if (deletedata ) {
            setShowSuccess(true);
        }
    }, [deletedata]);

    useEffect(() => {
        if (deletesomedata) {
            let {failedDeletions, message, success } = deletesomedata.deleteSelectLinks;
            if (failedDeletions) {
                alert('Some Failed To Delete. Please try them individually or contact an admin!');
                setSelectedIds(failedDeletions);
            }
            if (success) {
                setShowSuccess(true);
                setSelectedIds([]);
            }
        }
    }, [deletesomedata])


    const handleCheck = (id, isChecked) => {
        if (isChecked) {
          setSelectedIds(prev => [...prev, id]);
        } else {
          setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleDeleteChecked = () => {
        if (selectedIds.length === 0) {
            alert("How'd you access this without anything checked?");
            return;
        }

        deleteSomeLinks(selectedIds);
    }

    return (
        <div className="flex flex-col">
            {showSuccess && (
                <SuccessMessaging
                    message="Successfully Deleted!"
                    onClose={() => {
                        setShowSuccess(false);
                    }}
                    timeout={10 * 1000}
                >

                </SuccessMessaging>
            )}
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
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Clicks
                                    </th>

                                    <th scope="col" className="px-6 py-4">
                                        Private
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Private Password
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Delete
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        Check
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
                                        <td>
                                            <NameInput name={x.name || ''} id={x.id} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {x.clicks}
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
                                        <td className="whitespace-nowrap px-6 py-4 cursor-pointer">
                                            <span
                                                className=""
                                                onClick={() => {
                                                    deleteLink(x.id);
                                                }}
                                            >
                                                X
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    x.shortenedURL
                                                )}
                                                onChange={(e) =>
                                                    handleCheck(
                                                        x.shortenedURL,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                                
                        </table>
                        <div>
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
                                    aria-disabled={
                                        links.length < linkItemsPerPage
                                    }
                                    onClick={() => setLinkPage(linkPage + 1)}
                                    data-testid="link-pagination-next"
                                    className="disabled:opacity-50 w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                >
                                    Next
                                </button>
                                <button
                                    disabled={selectedIds.length === 0}
                                    aria-disabled={
                                        selectedIds.length === 0
                                    }
                                    onClick={() => {
                                        handleDeleteChecked();
                                    }}
                                    data-testid="link-pagination-next"
                                    className="float-right disabled:opacity-50 w-[150px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                >
                                    Delete Checked
                                </button>
  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkTable;
