import { fetchUserAttributes } from "aws-amplify/auth";

export async function checkLoginAndGetname(): Promise <string | undefined> {
    try {
        const attributes = await fetchUserAttributes();
        if (attributes.name) {
            return attributes.nickname
        }
        else{
            return 'Someone'
        } 

        

    } catch (error) {
        console.log('User is not logged in.')
            return undefined
    }
    
}