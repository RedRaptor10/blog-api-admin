import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../helpers/formatDate.js';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const Posts = ({user, setUser}) => {
    const [posts, setPosts] = useState([]);

    // Get API data on componentDidUpdate
    useEffect(() => {
        if (user) {
            fetch('http://localhost:3000/api/posts', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setPosts(res); });
        }
    }, [user]);

    const setPublished = (event, post) => {
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

        fetch('http://localhost:3000/api/posts/' + post._id + '/update', options)
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
            // Success. Fetch posts again.
            fetch('http://localhost:3000/api/posts', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setPosts(res); });
        })
        .catch(err => {
            console.log(err.message);
        });;
    };

    return (
        user && posts.length !== 0 ?
            <table>
                <tbody>
                    <tr>
                        <th>id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Controls</th>
                    </tr>
                    {posts.map((post) => {
                        return (
                            <tr key={post._id}>
                                <td>
                                <Link to={`/posts/${post._id}`}>{post._id}</Link>
                                </td>
                                <td>
                                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                                </td>
                                <td>{post.author.username}</td>
                                <td>{formatDate(post.date)}</td>
                                <td>{post.published ? 'Published' : 'Draft'}</td>
                                <td>
                                    <Link to={`/posts/${post._id}/update`}>
                                        <button>Edit</button>
                                    </Link>
                                    <Link to={`/posts/${post._id}/delete`}>
                                        <button>Delete</button>
                                    </Link>
                                    <button onClick={event => { setPublished(event, post); }}>{post.published ? 'Unpublish' : 'Publish'}</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        : null
    );
};

export default Posts;