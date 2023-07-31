import React from "react";

function ValidatePassword({validatePassword, password, setPassword, signInError}) {
    return (
        <form
            onSubmit={(e) => {
                validatePassword(e);
            }}
        >
            <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white"
            >
                Enter Your Current Password
            </label>
            <input
                id="password"
                data-testid="password-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full mt-1 px-3 py-2 border border-gray-300 ${
                    signInError ? "border-persianRed" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"`}
            />
            <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit
            </button>
            {signInError?.length > 0 && (
                <span className="font-bold text-persianRed text-lg">
                    Error: Invalid Password
                </span>
            )}
        </form>
    );
}

export default ValidatePassword;
