import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VolunteerProvider } from './context/VolunteerContext';
import { NotificationsProvider } from './context/NotificationsContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/certificates/Certificates';
import CertificateDetails from './pages/certificates/CertificateDetails';
import Announcements from './pages/announcements/Announcements';
import NotificationCenter from './pages/notifications/NotificationCenter';
import ProfileSetup from './pages/ProfileSetup';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import VerifyCertificate from './pages/VerifyCertificate';
import About from './pages/About';

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
import Messages from './pages/messages/Messages';
import Support from './pages/support/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import Reports from './pages/admin/Reports';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import AdminAnnouncementDashboard from './pages/admin/AdminAnnouncementDashboard';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminAnnouncementCreate from './pages/admin/AdminAnnouncementCreate';

// Volunteer Pages
import VolunteerAnalytics from './pages/volunteer/VolunteerAnalytics';

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

  if (allowedRoles && !allowedRoles.includes(user?.role?.toUpperCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Guard for auth pages
const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    const token = localStorage.getItem('authToken');
    if (token && !user) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f1ea' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #4a90e2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: '#333', fontWeight: 500 }}>Checking session...</p>
        </div>
      );
    }
    return children;
  }

  if (user) {
    const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'];
    if (adminRoles.includes(user?.role?.toUpperCase())) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthExpiredHandler = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => {
      if (!user) {
        navigate('/login?expired=true', { replace: true });
      }
    };
    window.addEventListener('auth-expired', handler);
    return () => window.removeEventListener('auth-expired', handler);
  }, [navigate, user]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <VolunteerProvider>
        <BrowserRouter>
          <AuthExpiredHandler />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="programs" element={<Programs />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="about" element={<About />} />
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
              <Route path="verify/:id" element={<VerifyCertificate />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Volunteer Routes */}
            <Route element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                <NotificationsProvider>
                  <DashboardLayout />
                </NotificationsProvider>
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notifications" element={<NotificationCenter />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="certificates/:id" element={<CertificateDetails />} />
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
              <Route path="messages" element={<Messages />} />
              <Route path="support" element={<Support />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={
              <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                <NotificationsProvider>
                  <DashboardLayout />
                </NotificationsProvider>
              </ProtectedRoute>
            }>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/announcements" element={<AdminAnnouncementDashboard />} />
              <Route path="admin/announcements/create" element={<AdminAnnouncementCreate />} />
              <Route path="admin/analytics" element={<AdminAnalytics />} />
              <Route path="admin/reports" element={<Reports />} />
              <Route path="admin/programs" element={<AdminPrograms />} />
              <Route path="admin/applications" element={<AdminApplications />} />
              <Route path="admin/attendance" element={<AdminAttendance />} />
              <Route path="admin/certificates" element={<AdminCertificates />} />
              <Route path="admin/messages" element={<Messages />} />
              <Route path="admin/support" element={<Support />} />
            </Route>

            {/* Protected Super Admin Routes */}
            <Route element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <NotificationsProvider>
                  <DashboardLayout />
                </NotificationsProvider>
              </ProtectedRoute>
            }>
              <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
            </Route>

            {/* Protected Volunteer Analytics */}
            <Route element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                <NotificationsProvider>
                  <DashboardLayout />
                </NotificationsProvider>
              </ProtectedRoute>
            }>
              <Route path="volunteer/analytics" element={<VolunteerAnalytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VolunteerProvider>
    </AuthProvider>
  );
}

export default App;
