import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.card}>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={styles.image}
        />
      )}
      <div style={styles.content}>
        <div style={styles.category}>{post.category?.name}</div>
        <h3 style={styles.title}>{post.title}</h3>
        <p style={styles.excerpt}>
          {post.content.substring(0, 150)}...
        </p>
        <div style={styles.meta}>
          <span style={styles.author}>By {post.author?.username}</span>
          <span style={styles.date}>{formatDate(post.createdAt)}</span>
        </div>
        <Link to={`/posts/${post._id}`} style={styles.link}>
          Read More →
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  category: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: '#2c3e50',
  },
  excerpt: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#95a5a6',
    marginBottom: '1rem',
  },
  author: {},
  date: {},
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default PostCard;