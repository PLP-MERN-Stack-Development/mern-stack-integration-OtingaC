import { useState } from 'react';
import { commentsAPI } from '../../services/api';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await commentsAPI.createComment({
        post: postId,
        content,
      });
      onCommentAdded(response.data);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
        rows="4"
        style={styles.textarea}
        maxLength="500"
      />
      <div style={styles.footer}>
        <small style={styles.charCount}>
          {content.length}/500 characters
        </small>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  charCount: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  button: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default CommentForm;