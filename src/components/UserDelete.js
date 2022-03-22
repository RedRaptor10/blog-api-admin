import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const UserDelete = ({user, setUser}) => {
    const { username } = useParams(); // Get username from url

    const deleteUser = event => {
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
            headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/users/' + username + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Success. Redirect to Users page
            window.location.href = '/users';
        });
    };

    return (
        user ?
            <div>
                Are you sure you want to delete user {username}?
                <button onClick={deleteUser}>Delete</button>
                <Link to="/">Cancel</Link>
            </div>
        : null
    );
};

export default UserDelete;