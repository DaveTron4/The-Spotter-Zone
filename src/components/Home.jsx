import React, { useState } from 'react'
import PostCard from './PostCard';

const Home = ({ userData, posts }) => {
  const [activeFilter, setActiveFilter] = useState('none');
  const [searchPost, setSearchPost] = useState('');

  // Filter posts by search term
  let filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchPost.toLowerCase()) ||
    post.content.toLowerCase().includes(searchPost.toLowerCase())
  );

  // Sort posts based on filter
  let sortedPosts = [...filteredPosts];
  if (activeFilter === 'mostLiked') {
    sortedPosts.sort((a, b) => b.likes - a.likes);
  } else if (activeFilter === 'latest') {
    sortedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return (
    <div className="container mt-5 pt-5">
      <h1>The Fit Board </h1>
      <input
        type="text"
        className="form-control mb-3 mt-3"
        placeholder="Search posts..."
        value={searchPost}
        onChange={(e) => setSearchPost(e.target.value)}
      />

      <h5>Order By:</h5>
      <div className="btn-group mb-3" role="group">
        <button
          className={`btn ${activeFilter === 'none' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('none')}
        >
          None
        </button>
        <button
          className={`btn ${activeFilter === 'latest' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('latest')}
        >
          Latest
        </button>
        <button
          className={`btn ${activeFilter === 'mostLiked' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('mostLiked')}
        >
          Most Liked
        </button>
      </div>

      {/* Post List */}
      {sortedPosts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          content={post.content}
          likes={post.likes}
          username={post.created_by}
          imageUrl={post.image_url}
          createdAt={post.created_at}
        />
      ))}
    </div>
  );
};

export default Home;
