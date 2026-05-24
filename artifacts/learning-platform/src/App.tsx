import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, ProtectedRoute } from "@/lib/contexts/AuthContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import Home         from "@/pages/Home";
import Courses      from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Learn        from "@/pages/Learn";
import Dashboard    from "@/pages/Dashboard";
import AccessCode   from "@/pages/AccessCode";
import Payment      from "@/pages/Payment";
import Pricing      from "@/pages/Pricing";
import Login        from "@/pages/auth/Login";
import Register     from "@/pages/auth/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function MainRoutes() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/"                  component={Home} />
        <Route path="/courses"           component={Courses} />
        <Route path="/courses/:courseId" component={CourseDetail} />
        <Route path="/learn/:courseId/:lessonId" component={Learn} />
        <Route path="/auth/login"        component={Login} />
        <Route path="/auth/register"     component={Register} />
        <Route path="/access-code"       component={AccessCode} />
        <Route path="/payment/:courseId" component={Payment} />
        <Route path="/pricing"           component={Pricing} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <ProtectedRoute path="/admin"           component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/courses"   component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/users"     component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/payments"  component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/codes"     component={AdminDashboard} adminOnly />
        <ProtectedRoute path="/admin/analytics" component={AdminDashboard} adminOnly />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin*" component={AdminRoutes} />
      <Route path="*"       component={MainRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
