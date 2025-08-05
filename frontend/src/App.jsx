import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatorDashboard from './pages/CreatorDashboard';
import EditorDashboard from './pages/EditorDashboard';
import PrivateRoute from './components/PrivateRoute';
import { isTokenExpired, logout } from './utils/auth'; // ✅ added

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      logout(); // ✅ auto logout if expired
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected route: only for creator */}
        <Route
          path="/creator-dashboard"
          element={
            <PrivateRoute allowedRoles={['creator']}>
              <CreatorDashboard />
            </PrivateRoute>
          }
        />

        {/* ✅ Protected route: only for editor */}
        <Route
          path="/editor-dashboard"
          element={
            <PrivateRoute allowedRoles={['editor']}>
              <EditorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
