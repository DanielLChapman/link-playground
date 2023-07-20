import React from 'react';
import { useUser } from '../User';
import UrlShortenerView from '../UrlShortener/UrlShortenerView';
import LinkTable from '../LinksHandling/LinkTable';

const LinkHandling = (props) => {
    const user = useUser();
    return (
        <div>
            {/* link handling*/}
            <UrlShortenerView user={user} />
            
            {/* Link Management */}
            <LinkTable user={user} />
        </div>
    );
}

export default LinkHandling;