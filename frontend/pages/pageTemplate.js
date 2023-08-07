import React from "react";
import Head from "next/head";
import App from "../src/Components/App"


function index(props) {

    return (
        <div>
            <Head>
                <title>Link Playground</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

            </Head>

            <div className="App flex flex-col min-h-screen justify-between">
                <Header user={user} />


                    
                <Footer />
            </div>


        </div>
    );
}

export default index;

