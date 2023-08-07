import React, { useEffect, useState } from "react";
import { CURRENT_USER_QUERY } from "../User";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { Router, useRouter } from "next/router";
import { DELETE_ALL_LINKS_FROM_USER } from "../Tools/Queries";
import { useDeleteAllLinks } from "../UrlShortener/DeleteAllLinks";
import { User } from "../../../tools/lib";


interface DeleteAccountProps {
    user: User;
}

const DeleteButton: React.FC<DeleteAccountProps> = ({ user }) => {
    //PROBABLY NOT NECESSARY TO KEEP SEPARATE, BUT TO AVOID ANY ACCIDENTAL DELETIONS AFTER EDITING
    //WILL MAKE THEM DO IT TWICE

    // State to track if the password has been validated
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);

    const {deleteAllLinks, data: linksdata, error: linkserror, loading: linksloading } = useDeleteAllLinks();


    // Function to delete the account
    const deleteLinksHandler = async () => {
        if (window.confirm("Are you sure you want to delete all your links?")) {
            let res = await deleteAllLinks();
        }
    };


    if (!user) return null;

    useEffect(() => {
        if (linksdata) {
            let {failedDeletions, message, success } = linksdata.deleteAllLinks;
            if (failedDeletions) {
                alert('Some Failed To Delete. Please try them individually or contact an admin!');
            }
            if (success) {
                alert('Successfully Deleted All Your Links!');
            }
        }
    }, [linksdata])

    return (
        <>
            
            {linkserror && (
                <span className="text-persianRed font-bold font-open text-lg">
                    Error Deleting Links, Refresh and Try Again
                </span>
            )}
            <button
                onClick={() => {
                    deleteLinksHandler
                }}
                className="text-lg font-semibold  w-full text-center text-red-600 hover:text-red-800 focus:outline-none"
            >
                Delete All Links
            </button>
            
        </>
    );
};

export default DeleteButton;
