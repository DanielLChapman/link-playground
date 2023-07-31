import React, { useEffect, useState } from "react";

type ErrorMessagingType = {
    errorMessage: string,
    setErrorMessage:  React.Dispatch<React.SetStateAction<{
        string
    }>>;
    timeout?: number,
}

const ErrorMessaging:React.FC<ErrorMessagingType> = ({errorMessage, setErrorMessage, timeout}) => {

    const [isVisible, setIsVisible] = useState(!!errorMessage);

    useEffect(() => {
        let timer;
        // If a timeout is defined, hide the message after the timeout
        if (timeout && isVisible) {
            timer = setTimeout(() => {
                setIsVisible(false);
                setErrorMessage(null);
            }, timeout);
        }

        // If the message changes, make the message visible
        if (errorMessage) {
            setIsVisible(true);
        }

        // Clear the timeout when the component unmounts
        return () => {
            clearTimeout(timer);
        };
    }, [errorMessage, timeout, isVisible, setErrorMessage]);

    if (!isVisible) {
        return null;
    }

    return (
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
    );
};

export default ErrorMessaging;
