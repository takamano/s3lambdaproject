import { useParams } from "react-router";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from "../../amplify/data/resource";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { Place } from "./Places";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { checkLoginAndGetName } from "../utils/AuthUtils"
import type { CustomEvent } from "./CreatePlace";
import Comment from "./Comment";

function PlaceDetails () {

    const client = generateClient<Schema>();
    const { id } = useParams();

    // 場所のReact Hook
    const [place, setPlace] = useState<Place | undefined>(undefined);
    // ユーザー認証のReact Hook
    const [userName, setUserName] = useState<string | undefined>();
    // コメントのReact Hook
    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        const handleData = async() =>{
            const name = await checkLoginAndGetName();
            console.log("Logged in as:", name); 
            if (name) {
                setUserName(name)
            }

            const result = await client.models.Place.get({id: id!})
            if (result.data){
                setPlace(result.data)
            }
        }
        handleData();
        const sub = client.models.Place.onUpdate(
            {
                filter: {
                    id: {
                        eq: id!
                    }
                }
            }
        ).subscribe({
            next: (data) => {
                if (data) {
                    setPlace(data)
                }
            }
        })
    }, [])

    function renderPhotos () {
        const rows: any[] = []
        if (place) {
            place.photos?.forEach(
                (photo, index) => {
                    if (photo) {
                        rows.push(
                        <StorageImage path={photo} alt={photo} key={index} height={300}/>       
                        )
                    }

                }
            )
        }
        return rows;
    }

    function renderCommentForm () {
        if (userName) {
            return(
                <form onSubmit={(e) => addComment(e)} >
                <input onChange={(e: CustomEvent) => setComment(e.target.value)} value={comment} />
                <input type="submit" value='コメントを追加。' />
                </form>
            )
        }
    }
    async function addComment(event: SyntheticEvent) {
        event.preventDefault();

        if (comment) {
            const currentComments = place?.comments ? place.comments : [];
            await client.models.Place.update({
                id: id!,
                comments:[...currentComments!,{
                    author: userName,
                    content: comment
                }]
            })
            setComment('')
        }
        
    }

    function renderPlace() {
        if (place) {
            return <div>
                <h2>場所「{place?.name}」の詳細：</h2><br />
                <p>{place?.name}</p>
                <p>{place?.description}</p>
                {renderPhotos()}<br />
                {renderCommentForm()}
                <p>Comments:</p>
                {renderComments()}
            </div>
        }
        else {
            return <h2>場所が見つかりません。</h2>
        }
    }

    function renderComments () {
        const rows: any[] = [];
        if (place?.comments) {
            for (let index = 0; index < place.comments.length; index ++ ) {
                const comment = place.comments[index];
                rows.push(<Comment author ={comment?.author} content={comment?.content} key={index} />)
            }
        }
        return rows
    }

    return <main>
        <h1>場所の詳細ページ：</h1><br />
        {renderPlace()}
    </main>
}

export default PlaceDetails