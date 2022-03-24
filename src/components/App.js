import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Users from './Users';
import UserDelete from './UserDelete';
import Posts from './Posts';
import Post from './Post';
import PostCreate from './PostCreate';
import PostEdit from './PostEdit';
import PostDelete from './PostDelete';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const App = () => {
  const [user, setUser] = useState();

  // Check authorization on componentDidMount
	useEffect(() => {
		let token = getCookie('blog_api_token');
		// If no token then unset user, delete cookie, and exit
		if (token === '') {
			setUser();
			deleteCookie('blog_api_token');
			return;
		}

		const options = {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + token },
			mode: 'cors'
		};

		fetch(process.env.SERVER + 'api/auth', options)
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
		.then(function(res) { setUser(res); })
		.catch(err => { console.log(err.message); });
	}, []);

  return (
    <HashRouter>
      <Header user={user} setUser={setUser} deleteCookie={deleteCookie} />
      <Routes>
        <Route exact path="/" element={<Home user={user} />} />
        <Route exact path="/users" element={<Users user={user} />} />
        <Route exact path="/users/:username/delete" element={<UserDelete user={user} setUser={setUser} />} />
        <Route exact path="/posts" element={<Posts user={user} setUser={setUser} />} />
        <Route exact path="/posts/:postId" element={<Post user={user} setUser={setUser} />} />
		<Route exact path="/posts/create" element={<PostCreate user={user} setUser={setUser} />} />
		<Route exact path="/posts/:postId/update" element={<PostEdit user={user} setUser={setUser} />} />
        <Route exact path="/posts/:postId/delete" element={<PostDelete user={user} setUser={setUser} />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;
