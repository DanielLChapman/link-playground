import React, { useState } from "react";

import { useUser } from "./User";
import UrlShortenerInput from "./UrlShortener/UrlShortenerInput";
import UrlShortenerView from "./UrlShortener/UrlShortenerView";

type AppInitialProps = {};

const App: React.FC<AppInitialProps> = () => {
    //user entry

    const user = useUser();

    
    

    return (
        <UrlShortenerView user={user} />
    );
};

export default App;
