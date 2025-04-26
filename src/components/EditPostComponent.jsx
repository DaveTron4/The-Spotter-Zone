import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../clients/SupaBaseClient';

const EditPostComponent = ({userData}) => {
    const {postId} = useParams();

    const [post, setPost] = useState([]);
    const [titleUpdate, setTitleUpdate] = useState('');
    const [contentUpdate, setContentUpdate] = useState('');
    const [imageUrlUpdate, setImageUrlUpdate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostInfo = async () => {
            const { data, error } = await supabase
                .from('Posts')
                .select()
                .eq('id', postId)
                .single();

            if (data) {
                setPost(data);
                setTitleUpdate(data.title);
                setContentUpdate(data.content);
                setImageUrlUpdate(data.image_url);
            } else console.error(error);
        };
        fetchPostInfo();
    },[postId])

    const updatePost = async (e) => {
        e.preventDefault();

        if (!userData) {
            return;
        }

        await supabase
            .from('Posts')
            .update({
                title: titleUpdate,
                content: contentUpdate,
                image_url: imageUrlUpdate,
            })
            .eq('id', postId);
    
        navigate("/");
      };

    return (
        <div className="container mt-5 pt-5">
            <h1>Edit Post</h1>
            <form onSubmit={updatePost}>
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Title"
                    value={titleUpdate}
                    onChange={(e) => setTitleUpdate(e.target.value)}
                    required
                />
                <textarea
                    className="form-control my-2"
                    placeholder="Content"
                    value={contentUpdate}
                    onChange={(e) => setContentUpdate(e.target.value)}
                    rows={5}
                    required
                />
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="image URL"
                    value={imageUrlUpdate}
                    onChange={(e) => setImageUrlUpdate(e.target.value)}
                />
                {userData
                    ? (
                        post.user_id === userData.id 
                        ? 
                            <button className="btn btn-primary w-100" type="submit">Update Post</button> 
                        : 
                            <>
                                <button disabled className="btn btn-primary w-100" type="submit">Update Post</button>
                                <p className="text-danger text-center mt-2">⚠️ You are not the creator of this post!</p>
                            </>
                    ) : (
                        <>
                            <button disabled className="btn btn-primary w-100" type="submit">Update Post</button>
                            <p className="text-danger text-center mt-2">⚠️ You are not logged in!</p>
                        </>
                    
                    )
                }
            </form>
        </div>
    )
}

export default EditPostComponent