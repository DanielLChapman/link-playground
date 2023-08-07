import React, { useState } from "react";


import SignOut from "./UserHandling/SignOut";
import { User } from "../../tools/lib";

export type UserOnlyProps = {
    user: User | null;
};

const Header: React.FC<UserOnlyProps> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <>
            <nav className="container relative mx-auto p-6 bg-snow dark:bg-jet dark:text-snow">
      
                <div className="flex flex-col flex-wrap sm:flex-row items-center justify-between mx-auto">
                    <a href="/" className="z-30 flex items-center">
                        INSERT LOGO HERE
                    </a>

                    <div
                        className="header-dropdown dropdown relative z-20 pt-2 sm:pt-4"
                        onMouseEnter={toggleMenu}
                        onMouseLeave={toggleMenu}
                    >
                        <div
                            className="dropdown-toggle text-center sm:text-right  tracking-wide"
                            onClick={toggleMenu}
                        >
                            <h3 className="text-2xl">
                                {user && (
                                    <>
                                        {" "}
                                        <a
                                            href="/user/account"
                                            className="text-jet dark:text-snow hover:text-persianRed font-bold font-open"
                                        >
                                            {user.username}
                                        </a>{" "}
                                    </>
                                )}
                                {!user && (
                                    <>
                                        {" "}
                                        <a
                                            href="/user/signin"
                                            className="text-jet dark:text-snow hover:text-persianRed font-bold font-open"
                                        >
                                            Sign In                                     </a>{" "}
                                    </>
                                )}
                                
                            </h3>
                        </div>
                        {isMenuOpen && user && (
                            <ul className="bg-snow dark:bg-jet rounded-lg font-merriweather text-semibold dropdown-menu pt-1 ml-2 sm:pt-1 z-30 sm:absolute text-center sm:text-right text-lg sm:w-[200px] text-jet dark:text-snow font-normal sm:-right-2 bg-opacity-60 group hover:bg-opacity-100 pr-2">
                                <li className="cursor-pointer hover:text-persianRed hover:font-semibold">
                                    <a href="/user/account">Account</a>
                                </li>
                                <li className="cursor-pointer hover:text-persianRed hover:font-semibold">
                                    <a href="/user/links">My Links</a>
                                </li>
                                <li className="">
                                    <SignOut />
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
