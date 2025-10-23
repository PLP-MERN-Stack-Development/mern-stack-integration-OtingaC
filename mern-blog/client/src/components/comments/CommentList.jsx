import { commentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CommentList = ({ comments, onCommentDeleted }) => {
  const { user } = useAuth();

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.deleteComment(commentId);
        onCommentDeleted(commentId);
      } catch (err) {
        alert('Failed to delete comment');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (comments.length === 0) {
    return <p style={styles.noComments}>No comments yet. Be the first to comment!</p>;
  }

  return (
    <div style={styles.list}>
      {comments.map((comment) => (
        <div key={comment._id} style={styles.comment}>
          <div style={styles.header}>
            <span style={styles.author}>{comment.author?.username}</span>
            <span style={styles.date}>{formatDate(comment.createdAt)}</span>
          </div>
          <p style={styles.content}>{comment.content}</p>
          {user && user._id === comment.author?._id && (
            <button
              onClick={() => handleDelete(comment._id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    marginTop: '1.5rem',
  },
  comment: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    borderLeft: '3px solid #3498db',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  author: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  date: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
  },
  content: {
    color: '#34495e',
    lineHeight: '1.6',
    marginBottom: '0.5rem',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  noComments: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '2rem',
    fontStyle: 'italic',
  },
};

export default CommentList;