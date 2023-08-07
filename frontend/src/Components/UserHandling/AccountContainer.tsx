import React, { useState } from "react";
import EditAccountInfo from "./EditAccountInfo";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { CURRENT_USER_QUERY } from "../User";
import DeleteButton from "./DeleteButton";
import ValidatePassword from "./ValidatePassword";
import { User } from "../../../tools/lib";

interface EditAccountInfoProps {
    user: User;
}

export interface UserUpdateInput {
    id: string;
    password?: string;
    username?: string;
    email?: string;
}

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser(
        $id: ID!
        $password: String
        $username: String
        $email: String
    ) {
        updateUser(
            where: { id: $id }
            data: { password: $password, username: $username, email: $email }
        ) {
            id
            username
            email
        }
    }
`;

const AccountContainer: React.FC<EditAccountInfoProps> = ({ user }) => {
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({
        username: "",
        password: "",
        email: "",
    });
    const [formValues, setFormValues] = useState({
        password: "",
        newUsername: user?.username || "",
        newPassword: "",
        newEmail: user?.email || "",
    });

    let [newSignIn, { data, error, loading }] = useMutation(SIGNIN_MUTATION);
    const [
        updateUser,
        {
            data: updateUserData,
            error: updateUserError,
            loading: updateUserLoading,
        },
    ] = useMutation(UPDATE_USER_MUTATION);

    const handleUpdate = async (type: string) => {
        let variables: UserUpdateInput = { id: user?.id };
        switch (type) {
            case "username":
                variables.username = formValues.newUsername;
                break;
            case "password":
                variables.password = formValues.newPassword;
                break;
            case "email":
                //weird error, should be caught on the backend but it flashes an error that isn't fun for the user
                //look into later, finish this now
                variables.email = formValues.newEmail;
                break;
            default:
                console.log(type);
        }

        let res = await updateUser({
            variables,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        if (res.data) {
            alert("Success");
            if (type === "password") {
                setFormValues({
                    ...formValues,
                    password: formValues.newPassword,
                });
            }
            if (type === "username") {
                let res2 = await newSignIn({
                    variables: {
                        username: formValues.newUsername,
                        password: formValues.password,
                    },
                    refetchQueries: [{ query: CURRENT_USER_QUERY }],
                });
            }
            setFormErrors({
                ...formErrors,
                [type]: "",
            });
        } else {
            setFormErrors({
                ...formErrors,
                [type]: res.errors,
            });
        }
    };

    // State to track if the password has been validated
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);

    // State for the password input field
    const [password, setPassword] = useState("");

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

    return (
        <section className="account-page w-full max-w-[1500px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {/* Edit Account Info */}
                <div className="account-info border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <button
                        onClick={() => setIsEditAccountOpen(!isEditAccountOpen)}
                        data-testid="account-edit-info"
                        className="text-lg w-full text-center font-semibold text-blue-600 hover:text-blue-800 dark:text-snow dark:hover:text-electricBlue  focus:outline-none"
                    >
                        Edit Account Info
                    </button>
                    {isEditAccountOpen ? (
                        isPasswordValidated &&
                        data?.authenticateUserWithPassword &&
                        data?.authenticateUserWithPassword.item.username ===
                            user.username ? (
                            <EditAccountInfo
                                formValues={formValues}
                                formErrors={formErrors}
                                setFormValues={setFormValues}
                                handleUpdate={handleUpdate}
                            />
                        ) : (
                            <ValidatePassword
                                validatePassword={validatePassword}
                                password={password}
                                setPassword={setPassword}
                                signInError={error}
                            />
                        )
                    ) : null}
                </div>

                <div className="account-info md:col-span-2 xl:col-span-1 border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    {isPasswordValidated &&
                    data?.authenticateUserWithPassword &&
                    data?.authenticateUserWithPassword.item.username ===
                        user.username ? (
                        <DeleteButton user={user} />
                    ) : (
                        <>
                            <button
                                className="text-lg cursor-normal font-semibold  w-full text-center text-red-600 hover:text-red-800 focus:outline-none"
                            >
                                Delete Account
                            </button>

                            <ValidatePassword
                                validatePassword={validatePassword}
                                password={password}
                                setPassword={setPassword}
                                signInError={error}
                            />
                        </>
                    )}
                </div>

                {/* Edit Delete */}
                <div className="account-info md:col-span-2 xl:col-span-1 border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <DeleteButton user={user} />
                </div>
            </div>
        </section>
    );
};

export default AccountContainer;
