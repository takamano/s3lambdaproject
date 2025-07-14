import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

import { Amplify } from 'aws-amplify';
import config from "../../config.json"

Amplify.configure({
    Auth:{
        Cognito:{
            userPoolId: config.amplify.userPoolId,
            userPoolClientId: config.amplify.userPoolClientId
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