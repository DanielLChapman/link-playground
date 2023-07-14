import React, { useState } from "react";
import { UserOnlyProps } from "../Header";
import UrlShortenerInput from "./UrlShortenerInput";
import SuccessMessaging from "../Tools/SuccessMessaging";

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

    const getUrl = () => {
        let url = `${baseURL}/${shortenedURL.shortenedURL}`;
        if (shortenedURL.isPrivate && shortenedURL.privatePass) {
            url += `/${shortenedURL.privatePass}`;
        }
        return url;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getUrl());
        alert("Copied To Clipboard");
    };

    const baseURL = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div>
            {shortenedURL.shortenedURL !== "" && (
                <SuccessMessaging message="Click The Link To Copy!" onClose={() => resetShorteendURL()}>
                    <span
                        className="block sm:inline pl-1 cursor-pointer"
                        onClick={handleCopy}
                    >
                        {getUrl()}
                    </span>
                </SuccessMessaging>
            )}
            <UrlShortenerInput user={user} setShortenedUrl={setShortenedUrl} />
        </div>
    );
};

export default UrlShortenerView;
