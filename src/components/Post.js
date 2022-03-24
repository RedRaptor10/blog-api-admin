import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Comment from './Comment';
import { formatDate } from '../helpers/formatDate.js';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const Post = ({user, setUser}) => {
    const { postId } = useParams(); // Get post id from url
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [commentToUpdate, setCommentToUpdate] = useState();

    // Get API data on componentDidUpdate
	useEffect(() => {
        if (user) {
            fetch(process.env.REACT_APP_SERVER + 'api/posts/' + postId, {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setPost(res); });

            fetch(process.env.REACT_APP_SERVER + 'api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setComments(res); });
        }
    }, [user, postId]);

    const setPublished = event => {
        event.preventDefault();

        let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: post.title,
                author: post.author._id,
                date: post.date,
                content: post.content,
                published: post.published ? false : true
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + postId + '/update', options)
        .then(function(res) {
            // If unauthorized then unset user, delete cookie, and throw error
            if (res.statusText === 'Unauthorized') {
                setUser();
                deleteCookie('blog_api_token');
                throw new Error(res.statusText);
            } else {
                return res.json();
            }
        })
        .then(function(res) {
            // Success. Set post state.
            setPost({
                ...post,
                published: post.published ? false : true
            });
        })
        .catch(err => {
            console.log(err.message);
        });;
    };

	return(
        post && post.author ?
            <main id="post">
                <div id="admin-controls">
                    <Link to={`/posts/${post._id}/update`}>Edit</Link>
                    <Link to={`/posts/${post._id}/delete`}>Delete</Link>
                    {!post.published ?
                        <span onClick={setPublished}>Publish</span>
                    :
                        <span onClick={setPublished}>Unpublish</span>
                    }
                </div>
                <div id="post-info">
                    <h1 id="post-title">{post.title}</h1>
                    <div id="post-author">by {post.author.username}</div>
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