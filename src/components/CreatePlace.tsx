import { useEffect, useState, type SyntheticEvent } from "react"
import { checkLoginAndGetname } from '../utils/AuthUtils';
import { NavLink } from "react-router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from '../../amplify/data/resource';

function CreatePlace () {

    const client = generateClient<Schema>().models.Place;

    const [userName, setUserName] = useState<string | undefined>();
    const [placeName, setPlaceName] =  useState<string>('');
    const [placeDescription, setPlaceDescription] = useState<string>('');

    useEffect (() => {
        const handleData = async () => {
            const name = await checkLoginAndGetname();
            if (name) {
                setUserName(name)
            }
        }
        handleData();
    }, [])

    async function handleSubmit(event:SyntheticEvent) {
        event.preventDefault();
        const place = client.create({
            name: placeName,
            description: placeDescription
        })
        console.log(place)
        alert(`Place with id: ${place.data?.id} created.`)
    }

    function renderCreatePlaceForm (){
    if (userName){
        return(
            <form onSubmit={(e)=> handleSubmit(e)}>
                <label>Place name:</label><br />
                <input value={placeName} onChange={(e)=> setPlaceName(e.target.value)} /> <br />
                <label>Place Description:</label><br />
                <input value={placeDescription} onChange={(e)=> setPlaceDescription(e.target.value)} /> <br />
                <input type="submit" value='Create Place:'/>
            </form>
        )
    }

    else {
        return 
        <div>
                    <h2>Log in to create places.</h2>
                    <NavLink to={"/auth"}>Login</NavLink>
        </div>
    }
}


    return <main>
        {renderCreatePlaceForm()}
    </main>
}

export default CreatePlace