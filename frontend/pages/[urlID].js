import React from 'react';
import { useRouter } from 'next/router'

function ShortenedUrl(props) {
    const router = useRouter()
    console.log(router.query);

    return (
        <div>
            Slug: {router.query.urlID}
        </div>
    );
}

export default ShortenedUrl;