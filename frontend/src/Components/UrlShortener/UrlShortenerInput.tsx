import React, { useState } from "react";
import { UserOnlyProps } from "../Header";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import useForm from "../../../tools/useForm";
import { isValidURL } from "../../../tools/urlChecking";
import { SetShortenedUrlType } from "../../../tools/lib";
import ErrorMessaging from "../Tools/ErrorMessaging";

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

type MyComponentProps = {
    setShortenedUrl: SetShortenedUrlType;
};

const UrlShortenerInput: React.FC<UserOnlyProps & MyComponentProps > = ({ user,setShortenedUrl }) => {
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
            setShortenedUrl({
                shortenedURL: res.data.generateShortenedURL.shortenedURL,
                privatePass: inputs.privatePass,
                isPrivate: inputs.isPrivate,
            })
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
                <ErrorMessaging errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
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
