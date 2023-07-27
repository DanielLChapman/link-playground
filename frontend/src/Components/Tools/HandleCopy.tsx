import { useCallback } from "react";

const baseURL = typeof window !== "undefined" ? window.location.origin : "";

// Put this inside your component function
export const getUrl = (shortened, isPrivate, privatePass) => {
    let url = `${baseURL}/${shortened}`;
    if (isPrivate && privatePass) {
        url += `/${privatePass}`;
    }
    return url;
};  // Assumes baseURL doesn't change, otherwise add it to the dependencies array

export const handleCopy = async (shortened, isPrivate, privatePass) => {
    await navigator.clipboard.writeText(
        getUrl(shortened, isPrivate, privatePass)
    );
    alert("Copied To Clipboard");
};
