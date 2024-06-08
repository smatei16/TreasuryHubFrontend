import React, { useState } from 'react';
import {storage} from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function Test() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [progressPercent, setProgressPercent] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const storageRef = ref(storage, 'test');
        const uploadTask = uploadBytesResumable(storageRef, file);

        if (!file) {
            alert("Please select a file first!");
            return;
        }

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressPercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                    console.log(imgUrl);
                });
            }
        );

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

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
                                text: "Send me a json with the amount and the merchant on this receipt."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpg;base64,${base64String}`
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
        };
        reader.readAsDataURL(file);
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
