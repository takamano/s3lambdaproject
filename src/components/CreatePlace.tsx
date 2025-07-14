import { useEffect, useState } from "react"
import { checkLoginAndGetname } from '../utils/AuthUtils';
import { NavLink } from "react-router";

function CreatePlace () {

    const [userName, setUserName] = useState<string | undefined>()

    useEffect (() => {
        const handleData = async () => {
            const name = await checkLoginAndGetname();
            if (name) {
                setUserName(name)
            }
        }
        handleData();
    }, [])

    function renderCreatePlaceForm() {
        if (userName) {
            return (
                <div>You are logged in.</div>
            )
        }
        else {
            return (
                <div>
                    <h2>Log in to create places.</h2>
                    <NavLink to={"/auth"}>Login</NavLink>
                </div>
            )
        }
    }

    return <main>
        {renderCreatePlaceForm()}
    </main>
}

export default CreatePlace