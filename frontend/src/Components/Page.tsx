import React from "react";
import { useUser } from "./User";
import Header from "./Header";
import Footer from "./Footer";

const Page = (props: any) => {

    const user = useUser();


    return (
        <main className="App flex flex-col min-h-screen justify-between">
            <Header user={user} />
                <div className="container">
                {props.children}
                </div>
                
            <Footer />

            
            {/*<link rel="stylesheet" href="main.css" />*/}
        </main>
    );
};

export default Page;
