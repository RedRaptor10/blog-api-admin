import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';
import Comment from './Comment';

const Post = ({user, setUser}) => {
    const { postId } = useParams(); // Get post id from url
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [commentToUpdate, setCommentToUpdate] = useState();

    // Get API data on componentDidUpdate
	useEffect(() => {
        fetch('http://localhost:3000/api/posts/' + postId, {mode: 'cors'})
		.then(function(res) { return res.json(); })
        .then(function(res) { setPost(res); });

        fetch('http://localhost:3000/api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
        .then(function(res) { return res.json(); })
        .then(function(res) { setComments(res); });
    }, [postId]);

	return(
        post && post.author ?
            <main id="post">
                <div id="post-info">
                    <h1 id="post-title">{post.title}</h1>
                    <div id="post-author">by <Link to={'/users/' + post.author.username}>{post.author.username}</Link></div>
                    <div id="post-date">{formatDate(post.date)}</div>
                    <p id="post-content">{post.content}</p>
                </div>
                <hr />
                <div id="post-comments">
                    <h3 id="post-comments-title">Comments</h3>
                    {comments.length !== 0 ?
                        comments.map(comment => {
                            return(
                                <Comment key={comment._id} user={user} setUser={setUser} comment={comment} setComments={setComments}
                                    commentToUpdate={commentToUpdate} setCommentToUpdate={setCommentToUpdate} />
                            )
                        })
                    : null}
                </div>
            </main>
        : null
	);
};

export default Post;