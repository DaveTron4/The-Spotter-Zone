import React from 'react'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart } from 'react-icons/fa';

const PostCard = ({ title, content, likes, username, imageUrl, createdAt  }) => {

  return (
    <div className="card mb-3">
        <Link to={`/post/${title}`} className="text-decoration-none text-dark">
            <div className="card-body position-relative">
                {/* Top-right image */}
                {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Post visual"
                    className="img-thumbnail position-absolute"
                    style={{ top: '1rem', right: '1rem', width: '80px', height: '80px', objectFit: 'cover' }}
                />
                )}

                <h5 className="card-title">{title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{`Creator: ${username}`}</h6>
                <p className="card-text">{content.length > 50 ? content.substring(0, 50) + '...' : content}</p>
                <p className="card-text">
                    <small className="text-muted">
                        Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </small>
                </p>
                <div className="d-flex justify-content-end">
                    <p className="card-text"><small className="text-muted"><FaHeart/> {likes} likes</small></p>
                </div>
            </div>
        </Link>
    </div>
  );
};

export default PostCard;
