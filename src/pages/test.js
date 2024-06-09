import React, { useState } from 'react';
import {storage} from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as imageConversion from "image-conversion";
import {v4} from "uuid";

function Test() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [progressPercent, setProgressPercent] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleImageUpload = async (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, v4());
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // const jpegImage = await imageConversion.compressAccurately(file, {
        //     type: 'image/jpeg',
        //     quality: 0.9,
        // });

        if (!file) {
            alert("Please select a file first!");
            return;
        }
        let imgUrl = '';
        imgUrl = await handleImageUpload(file);
        console.log(imgUrl);

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
                            text: "Send me a json with the date, merchant and an array named categories with category and amount on this receipt." +
                                "The categories are the following: housing, transportation, health, clothing, education, gifts, savings, other, entertainment." +
                                "If several products match the same category, sum the amounts up so that the categories do not repeat." +
                                "Put the products that do not match any categories in the other category." +
                                "If date or merchant cannot be identified, leave them empty."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                // url: `data:image/jpeg;base64,${base64String}`
                                url: imgUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        try {
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
                try {
                    console.log(JSON.parse(match[1]));
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }



        // const reader = new FileReader();
        // reader.onloadend = async () => {
        //     const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        //
        //     const headers = {
        //         "Content-Type": "application/json",
        //         "Authorization": "Bearer sk-proj-rkgamm7L7C9o9XYmlZukT3BlbkFJzXeeB1U3rG3NailGaRT4"
        //     }
        //
        //     const payload = {
        //         model: "gpt-4-turbo",
        //         messages: [
        //             {
        //                 role: "user",
        //                 content: [
        //                     {
        //                         type: "text",
        //                         text: "Send me a json with the date, merchant and an array named categories with category and amount on this receipt." +
        //                             "The categories are the following: housing, transportation, health, clothing, education, gifts, savings, other, entertainment." +
        //                             "If several products match the same category, sum the amounts up so that the categories do not repeat." +
        //                             "Put the products that do not match any categories in the other category."
        //                     },
        //                     {
        //                         type: "image_url",
        //                         image_url: {
        //                             // url: `data:image/jpeg;base64,${base64String}`
        //                             url: imgUrl
        //                         }
        //                     }
        //                 ]
        //             }
        //         ],
        //         max_tokens: 300
        //     };
        //
        //     try {
        //         const response = await fetch('https://api.openai.com/v1/chat/completions', {
        //             method: 'POST',
        //             headers: headers,
        //             body: JSON.stringify(payload),
        //         });
        //
        //         const data = await response.json();
        //         // setResponse(data);
        //         console.log('File uploaded successfully:', data);
        //         const text = data.choices[0].message.content
        //         console.log(text);
        //
        //         const regex = /```json\n([\s\S]*?)\n```/;
        //         const match = text.match(regex);
        //         if (match && match[1]) {
        //             try {
        //                 console.log(JSON.parse(match[1]));
        //             } catch (error) {
        //                 console.error('Error parsing JSON:', error);
        //             }
        //         }
        //     } catch (error) {
        //         console.error('Error uploading file:', error);
        //     }
        // };
        // reader.readAsDataURL(file);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Upload an Image</h1>
                <form onSubmit={handleSubmit}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button type="submit">Upload</button>
                </form>
                {response && <div className="response">
                    <h2>Response from API:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>}
            </header>
            <p>{progressPercent}</p>
            <p>{imgUrl}</p>
        </div>
    );
}

export default Test;
