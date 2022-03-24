import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const PostCreate = ({user, setUser}) => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        published: false
    });
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();

    const handleChange = event => {
        // On published form change, set state to form value
        let published = form.published;
        if (event.target.name === 'published') {
            published = event.target.checked;
        }

        setForm({
            ...form,
            [event.target.name]: event.target.value,
            published
        });
    };

    const createPost = event => {
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
            body: JSON.stringify({
                title: form.title,
                author: user.id,
                date: new Date(),
                content: form.content,
                published: form.published
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/create', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Fields required
            else {
                // Success. Redirect to Posts page
                navigate('/posts');
            }
        });
    };

    return (
        <main>
            {user ?
                <div id="post-edit">
                    <form id="post-form" action="">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" onChange={handleChange} value={form.title}></input>
                        <label htmlFor="content">Content</label>
                        <textarea type="textarea" name="content" onChange={handleChange} value={form.content}></textarea>
                        <input type="checkbox" name="published" onChange={handleChange} checked={form.published}></input>
                        <label htmlFor="published">Published</label>
                        <button type="submit" name="submit" onClick={createPost}>Create</button>
                        {formErrors.length !== 0 ?
                            <ul id="form-errors">
                                {formErrors.map((formError, i) => {
                                    return(
                                        <li key={i}>{formError.msg}</li>
                                    )
                                })}
                            </ul>
                        : null}
                    </form>
                </div>
            : null}
        </main>
    );
};

export default PostCreate;