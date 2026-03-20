import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppShell from './components/layout/AppShell';
import ChatWidget from './components/chat/ChatWidget';
import { Skeleton } from './components/ui';

const HomePage = lazy(() => import('./pages/HomePage'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Messages = lazy(() => import('./pages/Messages'));

function App() {
  return (
    <AppShell>
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
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </Suspense>
      <ChatWidget />
    </AppShell>
  );
}

export default App;
