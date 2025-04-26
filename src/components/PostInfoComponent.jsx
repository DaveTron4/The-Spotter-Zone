import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../clients/SupaBaseClient';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 

const PostInfoComponent = ({ userData }) => {
    const { title } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [updateLikes, setUpdateLikes] = useState(0);

    const navigate = useNavigate();

    function handleEditPost() {
        navigate(`/edit-post/${post.id}`)
    }

    // Deletes post
    const handleDeletePost = async (e) => {
        e.preventDefault();

        await supabase
        .from("Posts")
        .delete()
        .eq("id", post.id);

        navigate('/');
    }


    // Toggle to add likes
    const toggleLike = async () => {
        const newLiked = !liked;
        setLiked(newLiked);

        const newLikeCount = newLiked ? updateLikes + 1 : updateLikes - 1;
        setUpdateLikes(newLikeCount);

        const { error } = await supabase
            .from('Posts')
            .update({ likes: newLikeCount })
            .eq('id', post.id);

        if (newLiked) {
            await supabase
                .from('Likes')
                .insert({ post_id: post.id, user_id: userData.id }); // or userData.user.id
        } else {
            await supabase
                .from('Likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', userData.id);
        }
        
        if (error) {
            console.error("Failed to update likes:", error);
        }
    };

    useEffect(() => {
        // Fetch post data
        const fetchPostInfo = async () => {
            const { data, error } = await supabase
                .from('Posts')
                .select()
                .eq('title', title)
                .single();

            if (data) {
                setPost(data);
                setUpdateLikes(data.likes);
                fetchComments(data.id);
                if (userData) checkIfLiked(data.id);
            } else console.error(error);
        };

        // Fetch if post was liked
        const checkIfLiked = async (postId) => {
            const { data, error } = await supabase
                .from('Likes')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', userData.id)
                .single();
        
            if (data) setLiked(true);
            else console.log(error);
        };

        fetchPostInfo();
    }, [title]);

    // Fetch comments
    const fetchComments = async (postId) => {
        const { data, error } = await supabase
        .from('Comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

        if (data) {
            setComments(data);
        } else console.error(data);
    };

    // Post a comment
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        await supabase
        .from('Comments')
        .insert({
            post_id: post.id,
            user_name: userData?.user_metadata.display_name,
            content: newComment,
        })
        .select()
        .then(({data, error}) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Comment made succesfully: ", data);
                setComments(prev => [data[0], ...prev]);
                setNewComment('');
            }
        })
    };

    return (
        <div className="container mt-5 pt-5">
        {post ? (
            <div className="card shadow mb-4">
            <div className="card-body">
                <div className="d-flex">
                {post.image_url && (
                    <img
                    src={post.image_url}
                    alt={post.title}
                    className="me-3"
                    style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}/>
                )}
                <div>
                    <h4 className="mb-1">{post.title}</h4>
                    <p className="mb-2 text-muted">
                    Posted by <strong>{post.created_by}</strong>
                    </p>
                    <p>{post.content}</p>
                    {userData ? (
                        <button 
                            onClick={toggleLike} 
                            style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '1.5rem', 
                            color: liked ? 'red' : 'gray' 
                            }}
                        >
                            {liked ? <FaHeart /> : <FaRegHeart />} {updateLikes}
                        </button>
                        ) : (
                        <button 
                            disabled
                            style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            color: 'gray',
                            }}
                            title="Sign in to like posts"
                        >
                            <FaRegHeart /> {updateLikes}
                        </button>
                    )}
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {!userData && "You must be signed in to like this post."}
                    </p>
                </div>
                </div>
                <div className="d-flex justify-content-end mt-3 gap-2">
                {userData 
                    ? (
                        post.user_id === userData.id
                        ? 
                            <>
                                <button className="btn btn-sm btn-danger" onClick={handleDeletePost}>Delete</button>
                                <button className="btn btn-sm btn-warning" onClick={handleEditPost}>Edit</button>
                            </>
                        :
                            <>
                                <button disabled className="btn btn-sm btn-danger" onClick={handleDeletePost}>Delete</button>
                                <button disabled className="btn btn-sm btn-warning" onClick={handleEditPost}>Edit</button>
                            </>
                    ) : (
                        <>
                                <button disabled className="btn btn-sm btn-danger" onClick={handleDeletePost}>Delete</button>
                                <button disabled className="btn btn-sm btn-warning" onClick={handleEditPost}>Edit</button>
                        </>
                    )
                }
                
                </div>
            </div>
            </div>
        ) : (
            <div className="text-center">
            <h2>Loading...</h2>
            <img src="https://i.gifer.com/ZZ5H.gif" alt="loading" />
            </div>
        )}

        {/* Comment Section */}
        {post && (
            <div className="card shadow mb-4">
            <div className="card-body">
                <h5 className="card-title">Comments</h5>
                <form onSubmit={handleCommentSubmit} className="mb-3">
                <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="text-end mt-2">
                    <button className="btn btn-primary btn-sm" type="submit">
                    Post Comment
                    </button>
                </div>
                </form>

                {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="border-top pt-2">
                    <p className="mb-1"><strong>{comment.user_name ? comment.user_name : "Anonymous"}</strong></p>
                    <p className="mb-1">{comment.content}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {new Date(comment.created_at).toLocaleString()}
                    </p>
                    </div>
                ))
                ) : (
                <p className="text-muted">No comments yet.</p>
                )}
            </div>
            </div>
        )}
        </div>
    );
};

export default PostInfoComponent;
