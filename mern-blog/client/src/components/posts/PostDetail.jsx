import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import Loading from '../common/Loading';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getCommentsByPost(id);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c._id !== commentId));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!post) return <div style={styles.error}>Post not found</div>;

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div style={styles.container}>
      <div style={styles.post}>
        {post.image && (
          <img src={post.image} alt={post.title} style={styles.image} />
        )}
        <div style={styles.category}>{post.category?.name}</div>
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.meta}>
          <span>By {post.author?.username}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        {isAuthor && (
          <div style={styles.actions}>
            <Link to={`/edit-post/${post._id}`} style={styles.editBtn}>
              Edit Post
            </Link>
            <button onClick={handleDelete} style={styles.deleteBtn}>
              Delete Post
            </button>
          </div>
        )}
        <div style={styles.content}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          Comments ({comments.length})
        </h2>
        {isAuthenticated ? (
          <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
        ) : (
          <p style={styles.loginPrompt}>
            <Link to="/login" style={styles.loginLink}>Login</Link> to leave a comment
          </p>
        )}
        <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  post: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  category: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#7f8c8d',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    lineHeight: '1.8',
    color: '#34495e',
    fontSize: '1.1rem',
  },
  paragraph: {
    marginBottom: '1rem',
  },
  commentsSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
  },
  commentsTitle: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  loginLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
  },
};

export default PostDetail;