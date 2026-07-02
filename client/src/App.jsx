import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VolunteerProvider } from './context/VolunteerContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import ProfileSetup from './pages/ProfileSetup';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Volunteer Pages
import ApplicationForm from './pages/applications/ApplicationForm';
import MyApplications from './pages/applications/MyApplications';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import MyPrograms from './pages/programs/MyPrograms';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import CheckIn from './pages/attendance/CheckIn';
import CheckOut from './pages/attendance/CheckOut';
import AttendanceHistory from './pages/attendance/AttendanceHistory';
import VolunteerHours from './pages/attendance/VolunteerHours';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f4f1ea' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #4a90e2', 
          borderTopColor: 'transparent', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p style={{ marginTop: '1rem', color: '#333', fontWeight: 500 }}>Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Guard for auth pages
const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <VolunteerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="programs" element={<Programs />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="login" element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              } />
              <Route path="register" element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              } />
              <Route path="unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Volunteer Routes */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="profile/setup" element={<ProfileSetup />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="applications/:id" element={<ApplicationDetails />} />
              <Route path="programs/:programId/apply" element={<ApplicationForm />} />
              <Route path="my-programs" element={<MyPrograms />} />
              <Route path="attendance" element={<AttendanceDashboard />} />
              <Route path="attendance/check-in" element={<CheckIn />} />
              <Route path="attendance/checkout" element={<CheckOut />} />
              <Route path="attendance/history" element={<AttendanceHistory />} />
              <Route path="attendance/hours" element={<VolunteerHours />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VolunteerProvider>
    </AuthProvider>
  );
}

export default App;
