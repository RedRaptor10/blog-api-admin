import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';

const Posts = ({user}) => {
    const [posts, setPosts] = useState([]);

    // Get API data on componentDidUpdate
    useEffect(() => {
        if (user) {
            fetch('http://localhost:3000/api/posts', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setPosts(res); });
        }
    }, [user]);

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
                                    <span>Edit</span>
                                    <Link to={`/posts/${post._id}/delete`}>Delete</Link>
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