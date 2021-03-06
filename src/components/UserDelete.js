import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const UserDelete = ({user, setUser}) => {
    const { username } = useParams(); // Get username from url
    const navigate = useNavigate();

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

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + username + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Success. Redirect to Users page
            navigate('/users');
        });
    };

    return (
        <main>
            {user ?
                <div id="prompt">
                    Are you sure you want to delete user {username}?
                    <div>
                        <button onClick={deleteUser}>Delete</button>
                        <Link to="/users">
                            <button>Cancel</button>
                        </Link>
                    </div>
                </div>
            : null}
        </main>
    );
};

export default UserDelete;