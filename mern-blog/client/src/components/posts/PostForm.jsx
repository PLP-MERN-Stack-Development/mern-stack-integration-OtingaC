import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../../services/api';
import Loading from '../common/Loading';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        category: response.data.category._id,
      });
    } catch (err) {
      setError('Failed to fetch post');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    if (image) {
      data.append('image', image);
    }

    try {
      if (isEditMode) {
        await postsAPI.updatePost(id, data);
      } else {
        await postsAPI.createPost(data);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await categoriesAPI.createCategory(newCategory);
      setCategories([...categories, response.data]);
      setFormData({ ...formData, category: response.data._id });
      setNewCategory({ name: '', description: '' });
      setShowCategoryForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  if (loading && isEditMode) return <Loading />;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter post title"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <div style={styles.categoryRow}>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              style={styles.addCategoryBtn}
            >
              {showCategoryForm ? 'Cancel' : '+ New Category'}
            </button>
          </div>
        </div>

        {showCategoryForm && (
          <div style={styles.categoryForm}>
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              style={styles.input}
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              style={styles.createCatBtn}
            >
              Create Category
            </button>
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            style={styles.textarea}
            placeholder="Write your post content here..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Featured Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={styles.fileInput}
          />
          <small style={styles.hint}>
            Max size: 5MB. Formats: JPG, PNG, GIF
          </small>
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? 'Saving...'
              : isEditMode
              ? 'Update Post'
              : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#2c3e50',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    flex: 1,
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  fileInput: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  hint: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },
  categoryRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  addCategoryBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  categoryForm: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  createCatBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default PostForm;