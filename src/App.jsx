import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppShell from './components/layout/AppShell';
import ChatWidget from './components/chat/ChatWidget';
import { Skeleton } from './components/ui';
import { useAuth } from './context/AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Messages = lazy(() => import('./pages/Messages'));
const AdminLayout = lazy(() => import('./layouts/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));

function AuthGate({ adminOnly = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f4f8ff_48%,#eef4ff_100%)] px-4">
        <div className="surface-card w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          <h2 className="mb-2 text-xl font-extrabold text-[var(--color-text)]">Loading your workspace</h2>
          <p className="text-sm text-[var(--color-muted)]">Checking your session and permissions.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatWidget />
    </AppShell>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="container-app py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-4"
              >
                <Skeleton className="mb-4 aspect-[4/3] w-full rounded-[14px]" />
                <Skeleton className="mb-2 h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Routes>
        <Route
          path="/admin"
          element={
            <AuthGate adminOnly>
              <AdminLayout />
            </AuthGate>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Suspense>
  );
}

export default App;
