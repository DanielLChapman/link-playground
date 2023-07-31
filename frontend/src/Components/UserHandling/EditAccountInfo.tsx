// EditAccountInfo.tsx
import React, { useState, MouseEvent, FormEvent } from "react";
import { user } from "../../../tools/lib";
import { CURRENT_USER_QUERY } from "../User";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { MutationTuple } from "@apollo/client";
import UpdateFieldForm from "./UpdateFieldForm";
//import ReactPasswordChecklist from "react-password-checklist";

interface EditAccountInfoProps {
    formValues: {
        password: string;
        newUsername: string;
        newPassword: string;
        newEmail: string;
    };
    setFormValues: React.Dispatch<
        React.SetStateAction<{
            password: string;
            newUsername: string;
            newPassword: string;
            newEmail: string;
        }>
    >;

    formErrors: {
        username: string;
        password: string;
        email: string;
    };
    handleUpdate: (type: string) => Promise<void>;

}

const EditAccountInfo: React.FC<EditAccountInfoProps> = ({
    formValues,
    formErrors,
    setFormValues,
    handleUpdate,

}) => {
    const updateFormValue = (key: string, value: string) => {
        setFormValues((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="bg-snow dark:bg-jet font-open rounded-lg p-6 pt-10 ">
            
            {" "}
            <div className="-mt-4">
                <UpdateFieldForm
                    label="Change Username"
                    placeholder="New username"
                    value={formValues.newUsername}
                    error={formErrors["username"]}
                    fieldType="newUsername"
                    onChange={(value) => updateFormValue("newUsername", value)}
                    onSubmit={() => handleUpdate("username")}
                />
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate("password");
                }}
            >
                <label
                    htmlFor="newPassword"
                    className="block mt-4 text-sm font-medium text-gray-700 dark:text-snow"
                >
                    Change Password
                </label>
                <input
                    id="newPassword"
                    type="password"
                    autoComplete="password"
                    placeholder="New password"
                    value={formValues.newPassword}
                    onChange={(e) =>
                        updateFormValue("newPassword", e.target.value)
                    }
                    className={`block w-full mt-1 px-3 py-2 border ${
                        formErrors["password"]
                            ? "border-persianRed"
                            : "border-gray-300"
                    }  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 `}
                />
                <div className="mt-2 border-2 border-gray-300 p-2 font-open">
                    {/*  <ReactPasswordChecklist
                                rules={[
                                    "minLength",
                                    "specialChar",
                                    "number",
                                    "capital",
                                ]}
                                minLength={5}
                                value={newPassword}
                                onChange={(isValid) => setIsValid(isValid)}
                            />*/}
                </div>
                <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Update Password
                </button>
                {formErrors["password"] && (
                    <span className="font-bold text-persianRed text-lg">
                        Error: {formErrors["password"]}
                    </span>
                )}
            </form>
            <UpdateFieldForm
                label="Add / Change Email (for recovery)"
                placeholder="New Email"
                value={formValues.newEmail}
                error={formErrors["email"]}
                fieldType="newEmail"
                onChange={(value) => updateFormValue("newEmail", value)}
                onSubmit={() => handleUpdate("email")}
            />
        </div>
    );
};

export default EditAccountInfo;
