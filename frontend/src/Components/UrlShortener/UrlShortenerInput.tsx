import React, { useState } from "react";
import { UserOnlyProps } from "../Header";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import useForm from "../../../tools/useForm";
import { isValidURL } from "../../../tools/urlChecking";

export const CREATE_LINK = gql`
    mutation CreateShortenedLink(
        $originalURL: String!
        $isPrivate: Boolean
        $privatePass: String
    ) {
        generateShortenedURL(
            url: $originalURL
            isPrivate: $isPrivate
            privatePass: $privatePass
        ) {
            id
            shortenedURL
        }
    }
`;

const UrlShortenerInput: React.FC<UserOnlyProps> = ({ user }) => {
    const [createLink, { data, error, loading }] = useMutation(CREATE_LINK);
    // Set an initial state for error message.
    const [errorMessage, setErrorMessage] = useState(null);

    const { inputs, handleChange, clearForm, resetForm } = useForm({
        url: "",
        isPrivate: false,
        privatePass: "",
    });

    const handleCreateLinks = async () => {
        setErrorMessage(null);
        if (!isValidURL(inputs.url)) {
            setErrorMessage("Invalid URL");
            return;
        }
        let res = await createLink({
            variables: {
                originalURL: inputs.url,
                isPrivate: inputs.isPrivate,
                privatePass: inputs.privatePass,
            },
        });

        if (res.data.generateShortenedURL.shortenedURL) {
            resetForm();
        }

        if (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                handleCreateLinks();
            }}
        >
            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Oh snap!</strong>
                    <span className="block sm:inline">{errorMessage}</span>
                    <span
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => {
                            setErrorMessage(null);
                        }}
                    >
                        <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"></path>
                        </svg>
                    </span>
                </div>
            )}

            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="url">
                    Url
                    <input
                        required
                        type="text"
                        id="url-input"
                        name="url"
                        value={inputs.url}
                        placeholder="URL To Be Shortened"
                        onChange={handleChange}
                    />
                </label>

                {user && (
                    <div>
                        <label htmlFor="isPrivate">
                            Private {/* Hover Info Here */}
                            <input
                                type="checkbox"
                                name="isPrivate"
                                checked={inputs.isPrivate}
                                onChange={handleChange}
                            />
                        </label>
                        <label htmlFor="privatePass">
                            Private Password {/* Hover Info Here */}
                            <input
                                type="text"
                                name="privatePass"
                                value={inputs.privatePass}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                )}
                <button type="submit">Create URL</button>
            </fieldset>
        </form>
    );
};

export default UrlShortenerInput;
