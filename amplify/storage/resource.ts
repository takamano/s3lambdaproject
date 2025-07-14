import { defineStorage } from "@aws-amplify/backend";
import { generateThumb

 } from "../functions/resize/resource";
export const imageStorage = defineStorage({
    name: 's3images',
    access: (allow) => ({
        'originals/*': [
            allow.resource(generateThumb).to(['read']),
        ],
        'thumbs/*': [
            allow.resource(generateThumb).to(['write'])
        ]
    })
});