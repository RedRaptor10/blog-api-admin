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
                <Link to="/">Blog</Link>
            </h1>
            {user ?
                <div>
                    <Link to={`/users/${user.username}`}>
                        <button>{user.username}</button>
                    </Link>
                    <button onClick={logOut}>Log Out</button>
                </div>
            : null}
        </header>
    );
};

export default Header;