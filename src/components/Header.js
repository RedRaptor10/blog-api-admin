import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({user, setUser, deleteCookie}) => {
    const logOut = () => {
        fetch('http://localhost:3000/api/logout', {mode: 'cors'})
        .then(function() {
            setUser();
            deleteCookie('blog_api_token');
            window.location.href = '/';
        });
    };

    return(
        <header>
            <h1>
                <Link to="/">Blog - Admin</Link>
            </h1>
            {user ?
                <div>
                    <Link to="/users">
                        <button>Users</button>
                    </Link>
                    <Link to="/posts">
                        <button>Posts</button>
                    </Link>
                    <Link to="/posts/create">
                        <button>New Post</button>
                    </Link>
                    <button id="username">{user.username}</button>
                    <button onClick={logOut}>Log Out</button>
                </div>
            : null}
        </header>
    );
};

export default Header;