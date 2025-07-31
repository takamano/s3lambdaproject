import { useEffect, useState, type JSX } from "react";
import type { SyntheticEvent } from 'react';
import { checkLoginAndGetName } from "../utils/AuthUtils";
import { NavLink } from "react-router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { uploadData } from "aws-amplify/storage";


export type CustomEvent = {
    target: HTMLInputElement
}

function CreatePlace() {
    const [client, setClient] = useState<ReturnType<typeof generateClient<Schema>>["models"]["Place"] | null>(null);
    const [userName, setUserName] = useState<string | undefined>()
    const [placeName, setPlaceName] = useState<string>('');
    const [placeDescription, setPlaceDescription] = useState<string>('');
    const [placePhotos, setPlacePhotos] = useState<File[]>([])

    useEffect(() => {
        const handleData = async () => {
            // Amplifyが設定された後にclientを初期化
            const amplifyClient = generateClient<Schema>().models.Place;
            setClient(amplifyClient);
            
            const name = await checkLoginAndGetName();
            if (name) {
                setUserName(name)
            }
        }
        handleData();
    }, [])



        async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();

            // clientがnullでないことを確認
        if (!client) {
            console.error('Client not initialized');
            return;
        }

        if(placeName && placeDescription) {
            let placePhotosUrls: string[] = [];
            let placePhotosThumbsUrls: string[] = [];
            if (placePhotos) {
                const uploadResult = await uploadPhotos(placePhotos)
                placePhotosUrls = uploadResult.urls;
                placePhotosThumbsUrls = uploadResult.thumbs;
            }

            const place = await client.create({
                name: placeName,
                description: placeDescription,
                photos: placePhotosUrls,
                thumbs: placePhotosThumbsUrls
            })
            console.log(place)
            alert(`Place with id ${place.data?.id} created`)
            clearFields();
        }
    }
        function clearFields(){
            setPlaceName('');
            setPlaceDescription('');
            setPlacePhotos([]);
        }

        async function uploadPhotos(files: File[]): Promise<{
        urls: string[]
        thumbs: string[]
    }> {
        const urls: string[] = [];
        const thumbs: string[] = []
        for (const file of files) {
            console.log(`uploading file ${file.name}`)
            const result = await uploadData({
                data: file,
                path: `originals/${file.name}`
            }).result
            urls.push(result.path);
            thumbs.push(`thumbs/${file.name}`)
        }
        return {
            urls,
            thumbs
        };
    }
        
    

    function previewPhotos(event: CustomEvent){
        if (event.target.files){
            const eventPhotos = Array.from(event.target.files);
            const newFiles = placePhotos.concat(eventPhotos);
            setPlacePhotos(newFiles);
        }        

    }

    function renderPhotos(){
        const PhotoElements: JSX.Element[] = [];
        placePhotos.map((photo: File) =>{
            PhotoElements.push(
                <img key={photo.name} src={URL.createObjectURL(photo)} alt={photo.name} height={120}></img>
            )
        }) 
        return PhotoElements
    }

    function renderCreatePlaceForm() {
        if (userName) {
            return (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>場所の名前:</label><br />
                    <input value={placeName} onChange={(e) => setPlaceName(e.target.value)} /><br />
                    <label>場所の説明:</label><br />
                    <input value={placeDescription} onChange={(e) => setPlaceDescription(e.target.value)} /><br />
                    <label>場所の写真:</label><br />
                    <input type="file" multiple onChange={(e) => previewPhotos(e)} /><br />
                    {renderPhotos()}<br/>
                    <input type="submit" value='場所を作成' />
                </form>
            )
        } else {
            return <div>
                <h2>Login to create places:</h2>
                <NavLink to={"/auth"}>Login</NavLink>
            </div>
        }
    }

    return <main>
        {renderCreatePlaceForm()}
    </main>
}

export default CreatePlace