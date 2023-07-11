import React, { useState } from "react";

import { user as userType } from "../../tools/lib";

import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "./UserHandling/AccountContainer";
import { backendtype } from "./User";

export type UserOnlyProps = {
    user: userType | null;
};

const Header: React.FC<UserOnlyProps> = ({ user }) => {
    const [darkMode, setDarkMode] = useState(false);

    const [
        updateUser,
        {
            data: updateUserData,
            error: updateUserError,
            loading: updateUserLoading,
        },
    ] = useMutation(UPDATE_USER_MUTATION);

    /*
    const handleDarkModeSwitch = async () => {
        if (!user) {
            alert("Must Be Signed In");
            return;
        }
        
        if (+user.id === -1) {
            const updatedUser = { ...user, darkMode: !user.darkMode };
            setUser({ data: updatedUser }); // Update the stored user in local storage
            return;
        }

        console.log('here')

        const variables = {
            id: user.id,
            darkMode: !user.darkMode,
        };

        let res = await updateUser({
            variables,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
    };*/

    /*
    useEffect(() => {
        if (user.darkMode && document.querySelectorAll(".dark").length === 0) {
            document.querySelector("#htmlDocument").classList.add("dark");
        } else if (
            !user.darkMode &&
            document.querySelectorAll(".dark").length === 1
        ) {
            document.querySelector("#htmlDocument").classList.remove("dark");
        }
    }, [user]);
*/
    return (
        <>
            <nav className="container relative mx-auto p-6 bg-snow dark:bg-jet dark:text-snow">
                <div className="flex flex-col flex-wrap sm:flex-row items-center justify-between mx-auto">
                    <a href="/" className="z-30 flex items-center">
                        INSERT LOGO HERE
                    </a>
                </div>
                <div className="flex flex-col flex-wrap sm:flex-row items-center justify-between mx-auto">
                    <a href="/" className="z-30 flex items-center">
                        {user?.username}
                    </a>
                </div>
                {/*"flex flex-row justify-center space-x-20 my-6 md:justify-between"*/}
            </nav>
        </>
    );
};

export default Header;
