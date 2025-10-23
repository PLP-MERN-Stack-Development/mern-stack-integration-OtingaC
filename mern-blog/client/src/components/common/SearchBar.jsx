import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search posts..."
        style={styles.input}
      />
      <button type="submit" style={styles.searchBtn}>
        Search
      </button>
      {searchTerm && (
        <button type="button" onClick={handleClear} style={styles.clearBtn}>
          Clear
        </button>
      )}
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1,
    maxWidth: '500px',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  searchBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  clearBtn: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SearchBar;