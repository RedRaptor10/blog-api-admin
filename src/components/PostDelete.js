import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const PostDelete = ({user, setUser}) => {
    const { postId } = useParams(); // Get id from url

    const deletePost = event => {
        event.preventDefault();

        let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        let options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + postId + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Success. Redirect to Posts page
            window.location.href = '/posts';
        });
    };

    return (
        <main>
            {user ?
                <div id="prompt">
                    Are you sure you want to delete this post?
                    <div>
                        <button onClick={deletePost}>Delete</button>
                        <Link to="/">
                            <button>Cancel</button>
                        </Link>
                    </div>
                </div>
            : null}
        </main>
    );
};

export default PostDelete;