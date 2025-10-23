import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import PostForm from './components/posts/PostForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;