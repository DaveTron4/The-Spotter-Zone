import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../clients/SupaBaseClient';

const CreatePostComponent = ( {userData} ) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showLoginWarning, setShowLoginWarning] = useState(false);

    const navigate = useNavigate();

    // Create post
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userData) {
            setShowLoginWarning(true);
            return;
        }

        await supabase
        .from('Posts')
        .insert({
            title: title,
            content: content,
            user_id: userData.id,
            image_url: imageUrl,
            created_by: userData.user_metadata.display_name
        })
        .select()
        .then(({data, error}) => {
            if (error) {
                console.log('Error inserting data: ', error);
                alert('Error inserting data:', error.message);
            } else {
                console.log('Data inserted successfully:', data);
            }
        })
        setTitle('');
        setContent('');
        setImageUrl('');
        setShowLoginWarning(false);

        navigate('/');
    }
    
    return (
        <div className="container mt-5 pt-5">
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="form-control my-2"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    required
                />
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <button className="btn btn-primary w-100" type="submit">Create Post</button>
                {showLoginWarning && (
                    <p className="text-danger text-center mt-2">⚠️ You are not logged in!</p>
                )}
            </form>
        </div>
    )
}

export default CreatePostComponent