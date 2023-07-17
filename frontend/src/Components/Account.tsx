import React, { useState } from 'react';
import Header from './Header';
import { useUser } from './User';
import Footer from './Footer';
import { user } from '../../tools/lib';
import AccountContainer from './UserHandling/AccountContainer';

function Account() {
    const user = useUser()
    //to be updated later

    return (
        <div className="App flex flex-col min-h-screen justify-between">

            <main className="main-content container mx-auto bg-snow dark:bg-jet mb-auto">
                <AccountContainer user={user} />
            </main>

        </div>
    );
}

export default Account;