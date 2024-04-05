import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:5000/api/blogs/');
    setBlogs(result.data.map(blog => ({...blog, showFullContent: false}))); // Initialize showFullContent to false for all blogs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBlog = { title, content, author };
      await axios.post('http://localhost:5000/api/blogs/', newBlog);
      setTitle('');
      setContent('');
      setAuthor('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleContent = (id) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog._id === id) {
        blog.showFullContent = !blog.showFullContent;
      }
      return blog;
    });
    setBlogs(updatedBlogs);
  };

  return (
    <div className='main'>
      <h1>Blog Website</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <button type="submit">Add Blog</button>
      </form>
      <div>
        {blogs.map(blog => (
          <div className="blog-detail" key={blog._id}>
            <h2>{blog.title}</h2>
            <p>
              {blog.showFullContent ? blog.content : blog.content.slice(0, 100)}
              {blog.content.length > 100 && (
                <button onClick={() => handleToggleContent(blog._id)}>
                  {blog.showFullContent ? 'Read less' : 'Read more'}
                </button>
              )}
            </p>
            <p>Author: {blog.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
