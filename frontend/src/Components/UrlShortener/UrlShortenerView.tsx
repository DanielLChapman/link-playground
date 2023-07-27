import React, { useState } from "react";
import { UserOnlyProps } from "../Header";
import UrlShortenerInput from "./UrlShortenerInput";
import SuccessMessaging from "../Tools/SuccessMessaging";
import { getUrl, handleCopy } from "../Tools/HandleCopy";

const UrlShortenerView: React.FC<UserOnlyProps> = ({ user }) => {
    const [shortenedURL, setShortenedUrl] = useState({
        shortenedURL: "",
        privatePass: "",
        isPrivate: false,
    });

    const resetShorteendURL = () => {
        setShortenedUrl({
            shortenedURL: "",
            privatePass: "",
            isPrivate: false,
        });
    };

    return (
        <div>
            {shortenedURL?.shortenedURL !== "" && (
                <SuccessMessaging message="Click The Link To Copy!" onClose={() => resetShorteendURL()}>
                    <span
                        className="block sm:inline pl-1 cursor-pointer"
                        onClick={() => {
                            handleCopy(shortenedURL.shortenedURL, shortenedURL.isPrivate, shortenedURL.privatePass)
                        }}
                    >
                        {getUrl(shortenedURL.shortenedURL, shortenedURL.isPrivate, shortenedURL.privatePass)}
                    </span>
                </SuccessMessaging>
            )}
            <UrlShortenerInput user={user} setShortenedUrl={setShortenedUrl} />
        </div>
    );
};

export default UrlShortenerView;
