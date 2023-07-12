import React from "react";

import { useUser } from "./User";
import UrlShortenerInput from "./UrlShortener/UrlShortenerInput";

type AppInitialProps = {};

const App: React.FC<AppInitialProps> = () => {
    //user entry

    const user = useUser();
    

    return (
        <UrlShortenerInput user={user} />
    );
};

export default App;
