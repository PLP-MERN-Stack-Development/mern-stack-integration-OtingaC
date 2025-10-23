import { useState, useEffect } from 'react';
import { postsAPI, categoriesAPI } from '../../services/api';
import PostCard from './PostCard';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
      };
      const response = await postsAPI.getAllPosts(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) return <Loading />;

  return (
    <div>
      <h1 style={styles.title}>Blog Posts</h1>
      
      <div style={styles.filters}>
        <SearchBar onSearch={handleSearch} />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {posts.length === 0 ? (
        <p style={styles.noPosts}>No posts found</p>
      ) : (
        <>
          <div style={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minWidth: '200px',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  noPosts: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.2rem',
    padding: '2rem',
  },
};

export default PostList;