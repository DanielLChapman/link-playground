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

    // State for the password input field
    const [password, setPassword] = useState("");
    // Define the signIn mutation and handle data, error, and loading states
    const [newSignIn, { data, error: signInError, loading: signInLoading }] =
        useMutation(SIGNIN_MUTATION);
    // State to track if the sign-in prompt should be displayed
    const [signInPrompt, setSignInPrompt] = useState(false);

    // Function to validate the password
    const validatePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) {
            alert("You Must Be Signed In");
            return;
        }

        // Call the signIn mutation with the entered password
        let res = await newSignIn({
            variables: {
                username: user.username,
                password: password,
            },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        // Check if the password is correct and update the state accordingly
        if (
            res.data.authenticateUserWithPassword.__typename ===
            "UserAuthenticationWithPasswordSuccess"
        ) {
            setIsPasswordValidated(true);
            setSignInPrompt(false);
            setPassword("");
        }
    };

    // Function to delete the account
    const deleteLinksHandler = async () => {
        if (window.confirm("Are you sure you want to delete all your links?")) {
            let res = await deleteAllLinks();
        }
    };
    if (!user) {
        return <a href="/user/signin"><h3 className="text-jet dark:text-snow font-bold text-2xl w-full text-center">Please Sign In</h3></a>
    }

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
            
            {deleteError && (
                <span className="text-persianRed font-bold font-open text-lg">
                    Error Deleting Account
                </span>
            )}
            <button
                onClick={() => {
                    if (
                        isPasswordValidated &&
                        data?.authenticateUserWithPassword &&
                        data?.authenticateUserWithPassword.item.username ===
                            user.username
                    ) {
                        deleteAccount();
                    } else {
                        setSignInPrompt(true);
                    }
                }}
                className="text-lg font-semibold  w-full text-center text-red-600 hover:text-red-800 focus:outline-none"
            >
                {isPasswordValidated
                    ? "Confirm Account Deletion"
                    : "Delete Account"}
            </button>
            {signInPrompt && (
                <div className="bg-snow font-open rounded-lg p-6">
                    <form
                        onSubmit={(e) => {
                            validatePassword(e);
                        }}
                    >
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Enter Your Current Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            autoComplete="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full mt-1 px-3 py-2 border border-gray-300 ${
                                signInError
                                    ? "border-persianRed"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"`}
                        />
                        <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit
                        </button>
                        {signInError  && (
                            <span className="font-bold text-persianRed text-lg">
                                Error: Invalid Password
                            </span>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
