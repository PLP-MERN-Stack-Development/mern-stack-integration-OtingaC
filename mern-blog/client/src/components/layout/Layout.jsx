import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.container}>
          {children}
        </div>
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 MERN Blog App. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: '2rem 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
    marginTop: 'auto',
  },
};

export default Layout;