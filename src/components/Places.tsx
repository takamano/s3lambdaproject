import { useState, useEffect } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import PlaceComponent from "./PlaceComponent";

export type Place = Schema["Place"]['type']


function Places() {

    const client = generateClient<Schema>();
    const [places, setPlaces] = useState<Place[]>([])
    console.log("Model Checks:")
    console.log(client.models)

    useEffect(() => {
        const handleData = async () => {
            const subscription = client.models.Place.observeQuery().subscribe({
                next: (data) => setPlaces([...data.items])
            })
            return () => subscription.unsubscribe();
        }
        handleData();
    }, []);

    function renderPlaces() {
        const rows: any[] = []
        for (const place of places) {
            rows.push(<PlaceComponent place={place} key={place.id} />)
        }
        return rows
    }

    return <main>
        <h1>Here are the awesome places you visited:</h1><br />
        {renderPlaces()}
    </main>





}

export default Places
