const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div style={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.disabled : {}),
        }}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          style={{
            ...styles.button,
            ...(page === currentPage ? styles.active : {}),
            ...(page === '...' ? styles.ellipsis : {}),
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...styles.button,
          ...(currentPage === totalPages ? styles.disabled : {}),
        }}
      >
        Next
      </button>
    </div>
  );
};

const styles = {
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
  },
  button: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.3s',
  },
  active: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  ellipsis: {
    cursor: 'default',
    border: 'none',
  },
};

export default Pagination;