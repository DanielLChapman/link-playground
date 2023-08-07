import React, { useState } from "react";
import { CURRENT_USER_QUERY } from "../User";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { Router, useRouter } from "next/router";
import { User } from "../../../tools/lib";

export const DELETE_USER_MUTATION = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;

interface DeleteAccountProps {
    user: User;
}

const DeleteButton: React.FC<DeleteAccountProps> = ({ user}) => {
    //PROBABLY NOT NECESSARY TO KEEP SEPARATE, BUT TO AVOID ANY ACCIDENTAL DELETIONS AFTER EDITING
    //WILL MAKE THEM DO IT TWICE
    // Define the deleteUser mutation and handle loading and error states
    const [deleteUser, { loading: deleteLoading, error: deleteError }] =
        useMutation(DELETE_USER_MUTATION);
    // useRouter hook to enable navigation after successful deletion
    const router = useRouter();


    // Function to delete the account
    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser({ variables: { id: user.id } });
                alert("User deleted successfully.");
                router.push("/");
            } catch (e) {
                console.error("Error deleting user:", e);
                alert(
                    "An error occurred while deleting the user. Please try again."
                );
            }
        }
    };

    if (!user) {
        return (
            <a href="/user/signin">
                <h3 className="text-jet dark:text-snow font-bold text-2xl w-full text-center">
                    Please Sign In
                </h3>
            </a>
        );
    }

    return (
        <>
            {deleteError && (
                <span className="text-persianRed font-bold font-open text-lg">
                    Error Deleting Account
                </span>
            )}
            <button
                onClick={() => {
                    deleteAccount();
                }}
                className="text-lg font-semibold  w-full text-center text-red-600 hover:text-red-800 focus:outline-none"
            >
                Delete Account
            </button>
           
        </>
    );
};

export default DeleteButton;
