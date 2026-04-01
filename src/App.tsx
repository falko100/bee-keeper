import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HivesPage = lazy(() => import('./pages/HivesPage'));
const HiveDetailPage = lazy(() => import('./pages/HiveDetailPage'));
const InspectionFormPage = lazy(() => import('./pages/InspectionFormPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const PlanningPage = lazy(() => import('./pages/PlanningPage'));
const TipsPage = lazy(() => import('./pages/TipsPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center py-20 min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
    </div>
  );
}

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <AuthPage />;

  return (
    <AppProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/hives" element={<HivesPage />} />
          <Route path="/hives/:id" element={<HiveDetailPage />} />
          <Route path="/hives/:id/inspect" element={<InspectionFormPage />} />
          <Route path="/hives/:id/inspect/:inspId" element={<InspectionFormPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/tips" element={<TipsPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <AuthenticatedApp />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
