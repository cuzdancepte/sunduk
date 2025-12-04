import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Languages from './pages/Languages';
import Levels from './pages/Levels';
import Units from './pages/Units';
import Lessons from './pages/Lessons';
import Exercises from './pages/Exercises';
import Exams from './pages/Exams';
import Users from './pages/Users';
import Subscriptions from './pages/Subscriptions';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="languages" element={<Languages />} />
        <Route path="levels" element={<Levels />} />
        <Route path="units" element={<Units />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="exams" element={<Exams />} />
        <Route path="users" element={<Users />} />
        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

