import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebase";
import {v4} from "uuid";

export const handleImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `${v4()}.jpeg`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                // setProgressPercent(progress);
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

export const generateReceiptInfo = async (url, categories) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-proj-rkgamm7L7C9o9XYmlZukT3BlbkFJzXeeB1U3rG3NailGaRT4"
        }

        const payload = {
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Send me a json with the 'date' in yyyy-MM-ddThh:mm format, 'merchant' and an array named 'categories' with 'id' and 'amount' on this receipt." +
                                `The categories are the following: ${JSON.stringify(categories)}. Match the categories by name, but return the category 'id' in the json.` +
                                "If several products match the same category, sum the amounts up so that the returned ids do not repeat." +
                                "Put the products that do not match any categories in the 'other' category id." +
                                "If date or merchant cannot be identified, leave them empty." +
                                "In many cases, the date from the receipt have the month and the day switched."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                // url: `data:image/jpeg;base64,${base64String}`
                                url: url
                            }
                        }
                    ]
                }
            ],
            max_tokens: 2000
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        // setResponse(data);
        console.log('File uploaded successfully:', data);
        const text = data.choices[0].message.content
        console.log(text);

        const regex = /```json\n([\s\S]*?)\n```/;
        const match = text.match(regex);
        if (match && match[1]) {
            const response = JSON.parse(match[1]);
            console.log(response);
            return response;
        }
    } catch (error) {
        console.log("Error generating receipt info.");
        throw error;
    }
}