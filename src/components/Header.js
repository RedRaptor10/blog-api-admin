import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({user, setUser, deleteCookie}) => {
    const navigate = useNavigate();

    const logOut = () => {
        fetch(process.env.REACT_APP_SERVER + 'api/logout', {mode: 'cors'})
        .then(function() {
            setUser();
            deleteCookie('blog_api_token');
            navigate('/');
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