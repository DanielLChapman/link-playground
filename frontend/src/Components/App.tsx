import React from "react";

import Footer from "./Footer";
import Header from "./Header";

import { useUser } from "./User";

type AppInitialProps = {};

const App: React.FC<AppInitialProps> = () => {
    //user entry

    const user = useUser();

    return (
        <div className="App flex flex-col min-h-screen justify-between">
            <Header user={user} />

            <Footer />
        </div>
    );
};

export default App;
