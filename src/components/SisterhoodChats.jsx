import React, { useState, useEffect } from 'react';
import axios from '../config/api';

const SisterhoodChats = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPost, setNewPost] = useState({ category: 'general', content: '', isAnonymous: false });
    const [selectedPost, setSelectedPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [commentAnonymous, setCommentAnonymous] = useState(false);

    const categories = [
        { id: 'all', name: 'Popular', icon: '🔥', color: '#ff6b9d' },
        { id: 'breakup', name: 'Breakup Support', icon: '💔', color: '#e91e63' },
        { id: 'selfcare', name: 'Self-Care', icon: '💆‍♀️', color: '#9c27b0' },
        { id: 'health', name: 'Health', icon: '🏥', color: '#f44336' },
        { id: 'relationships', name: 'Relationships', icon: '💕', color: '#ff4081' },
        { id: 'advice', name: 'Advice', icon: '💡', color: '#ffc107' },
        { id: 'general', name: 'General', icon: '💬', color: '#2196f3' }
    ];

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const url = selectedCategory === 'all'
                ? '/api/posts'
                : `/api/posts?category=${selectedCategory}`;
            const res = await axios.get(url);
            setPosts(res.data.posts);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!newPost.content.trim()) {
            alert('Please write something!');
            return;
        }

        try {
            await axios.post('/api/posts', {
                userId: user.id,
                username: user.username,
                category: newPost.category,
                content: newPost.content,
                isAnonymous: newPost.isAnonymous
            });

            setNewPost({ category: 'general', content: '', isAnonymous: false });
            setShowNewPostForm(false);
            fetchPosts();
            alert('✅ Post shared with the community!');
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post. Please try again.');
        }
    };

    const handleLikePost = async (postId) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/like`, {
                userId: user.id
            });

            // Update the post in the list
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, likes_count: res.data.liked ? p.likes_count + 1 : p.likes_count - 1 }
                    : p
            ));

            // Update selected post if viewing
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost({
                    ...selectedPost,
                    likes_count: res.data.liked ? selectedPost.likes_count + 1 : selectedPost.likes_count - 1
                });
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleViewPost = async (post) => {
        try {
            const res = await axios.get(`/api/posts/${post.id}`);
            setSelectedPost(res.data.post);
            setNewComment('');
            setCommentAnonymous(false);
        } catch (err) {
            console.error('Error fetching post details:', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            alert('Please write a comment!');
            return;
        }

        try {
            await axios.post(`/api/posts/${selectedPost.id}/comment`, {
                userId: user.id,
                username: user.username,
                comment: newComment,
                isAnonymous: commentAnonymous
            });

            setNewComment('');
            setCommentAnonymous(false);

            // Refresh post details
            const res = await axios.get(`/api/posts/${selectedPost.id}`);
            setSelectedPost(res.data.post);

            // Update comments count in posts list
            setPosts(posts.map(p =>
                p.id === selectedPost.id
                    ? { ...p, comments_count: p.comments_count + 1 }
                    : p
            ));
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment. Please try again.');
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    // If viewing a specific post
    if (selectedPost) {
        return (
            <div className="card sisterhood-chats-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <button
                        onClick={() => setSelectedPost(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        ←
                    </button>
                    <h3 style={{ margin: 0 }}>💬 Post Details</h3>
                </div>

                {/* Post Content */}
                <div className="post-detail">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>
                                {selectedPost.username}
                            </p>
                            <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
                                {formatTimeAgo(selectedPost.created_at)}
                            </p>
                        </div>
                        <span className="category-badge" style={{
                            background: categories.find(c => c.id === selectedPost.category)?.color || '#999',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {categories.find(c => c.id === selectedPost.category)?.icon} {selectedPost.category}
                        </span>
                    </div>

                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px' }}>
                        {selectedPost.content}
                    </p>

                    <div style={{ display: 'flex', gap: '15px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                        <button
                            onClick={() => handleLikePost(selectedPost.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            ❤️ {selectedPost.likes_count}
                        </button>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                            💬 {selectedPost.comments_count} comments
                        </span>
                    </div>
                </div>

                {/* Comments Section */}
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Comments</h4>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} style={{ marginBottom: '15px' }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            style={{
                                width: '100%',
                                minHeight: '60px',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                marginBottom: '8px'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={commentAnonymous}
                                    onChange={(e) => setCommentAnonymous(e.target.checked)}
                                    style={{ marginRight: '5px' }}
                                />
                                Post anonymously
                            </label>
                            <button
                                type="submit"
                                style={{
                                    padding: '8px 20px',
                                    background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Comment
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedPost.comments && selectedPost.comments.length > 0 ? (
                            selectedPost.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    style={{
                                        background: '#f9f9f9',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #f0f0f0'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.85rem' }}>
                                            {comment.username}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#999' }}>
                                            {formatTimeAgo(comment.created_at)}
                                        </p>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                                        {comment.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Main view
    return (
        <div className="card sisterhood-chats-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>💬 Sisterhood Chats</h3>
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {showNewPostForm ? 'Cancel' : '✍️ New Post'}
                </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
                <form onSubmit={handleCreatePost} className="new-post-form">
                    <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            marginBottom: '10px',
                            fontSize: '0.9rem'
                        }}
                    >
                        {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Share your thoughts, ask for advice, or support others..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.9rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            marginBottom: '10px'
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={newPost.isAnonymous}
                                onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                                style={{ marginRight: '5px' }}
                            />
                            Post anonymously
                        </label>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Share Post
                        </button>
                    </div>
                </form>
            )}

            {/* Category Filter */}
            <div className="category-filter" style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                marginBottom: '15px',
                paddingBottom: '10px'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: selectedCategory === cat.id ? 'none' : '1px solid #ddd',
                            background: selectedCategory === cat.id
                                ? `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`
                                : 'white',
                            color: selectedCategory === cat.id ? 'white' : '#666',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {/* Posts List */}
            <div className="posts-list">
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        No posts yet in this category. Be the first to share!
                    </p>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            className="post-card"
                            onClick={() => handleViewPost(post)}
                            style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                        {post.username}
                                    </p>
                                    <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
                                        {formatTimeAgo(post.created_at)}
                                    </p>
                                </div>
                                <span style={{
                                    background: categories.find(c => c.id === post.category)?.color || '#999',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    height: 'fit-content'
                                }}>
                                    {categories.find(c => c.id === post.category)?.icon}
                                </span>
                            </div>

                            <p style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                marginBottom: '10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {post.content}
                            </p>

                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#666' }}>
                                <span>❤️ {post.likes_count}</span>
                                <span>💬 {post.comments_count}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SisterhoodChats;
