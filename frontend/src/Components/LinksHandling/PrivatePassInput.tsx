import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UPDATE_LINK } from '../Tools/Queries';

const PrivatePassInput:React.FC<{initialPass: string, id:string, }> = ({initialPass, id}) => {

    const [password, setPassword] = useState(initialPass);
    const [updatePassword, { loading, error }] = useMutation(UPDATE_LINK, {
        onCompleted: (data) => {
            alert('Password updated successfully');
        },
        onError: (error) => {
            alert('An error occurred while updating password');
        }
    });

    return (
        <>
            <input
                type="text"
                placeholder="Enter a password"
                value={password}
                onChange={(e) =>{
                    setPassword(e.target.value);
                }}
            />
            <button onClick={() => {
                updatePassword({
                    variables: {
                        id: id,
                        privatePass: password
                    },
                })
            }}>Submit</button>
        </>
    );
}

export default PrivatePassInput;