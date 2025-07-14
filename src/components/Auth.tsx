import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

import { Amplify } from 'aws-amplify';
import config from "../../config.json"


const userPoolId = import.meta.env.VITE_USER_POOL_ID || config.amplify.userPoolId;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID || config.amplify.userPoolClientId;

Amplify.configure({
    Auth:{
        Cognito:{
            userPoolId,
            userPoolClientId
        }
    }
})

export default function Auth() {

    return <>
        <Authenticator signUpAttributes={[
            'nickname'
        ]}>
            {/* This is what you see when you sign in */}
            {({ signOut }) => (
                <main>
                    <UserDetails />
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    </>
}

function UserDetails() {
    const [nickName, setNickName] = useState<string>();

    useEffect(() => {
        async function getUserData() {
            const userData = await fetchUserAttributes()
            setNickName(userData.nickname)
        }
        getUserData()
    }, [])


    return <div>
        <h1> Hello {nickName}</h1>

    </div>
}