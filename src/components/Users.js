import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const User = ({user}) => {
    const [users, setUsers] = useState([]);

    // Get API data on componentDidUpdate
    useEffect(() => {
        if (user) {
            fetch('http://localhost:3000/api/users', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setUsers(res); });
        }
    }, [user]);

    return (
        <main>
            {user && users.length !== 0 ?
                <table id="table-users">
                    <tbody>
                        <tr>
                            <th>id</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Controls</th>
                        </tr>
                        {users.map((userData) => {
                            return (
                                <tr key={userData._id}>
                                    <td>{userData._id}</td>
                                    <td>{userData.username}</td>
                                    <td>{userData.role}</td>
                                    <td>
                                        {userData.role !== 'admin' ?
                                            <Link to={`/users/${userData.username}/delete`}>Delete</Link>
                                        : null}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            : null}
        </main>
    );
};

export default User;