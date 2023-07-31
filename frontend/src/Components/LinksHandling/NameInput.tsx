import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UPDATE_LINK } from '../Tools/Queries';

function NameInput({name, id}) {
    const [currentName, setCurrentName] = useState(name);
    const [showSubmit, setShowSubmit] = useState(false);

    const [updateLink, {data, error, loading}] = useMutation(UPDATE_LINK);

    const handleChange = (e) => {
        setCurrentName(e.target.value);
        if (e.target.value === name) {
            setShowSubmit(false);
        } else {
            setShowSubmit(true);
        }
    }

    const handleSubmit = async () => {
        if (name === currentName) {
            return;
        }
        let res = await updateLink({
            variables: {
                id: id,
                name: currentName
            }
        });

        if (res?.data?.updateShortenedLink) {
            alert('success');
        } else {
            alert('Error, please try again!');
        }

        setShowSubmit(false);
    }

    return (
        <>
            <input 
                value={currentName}
                onChange={(e) => {
                    handleChange(e);
                }}
                />        
            {
                showSubmit && (
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                )
            }
        </>
    );
}

export default NameInput;