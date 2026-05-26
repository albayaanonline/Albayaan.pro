import { useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, ProtectedRoute } from "@/lib/contexts/AuthContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SplashScreen } from "@/components/SplashScreen";

import Home             from "@/pages/Home";
import Courses          from "@/pages/Courses";
import Curriculum       from "@/pages/Curriculum";
import CourseDetail     from "@/pages/CourseDetail";
import Learn            from "@/pages/Learn";
import Dashboard        from "@/pages/Dashboard";
import MyCertificates   from "@/pages/MyCertificates";
import AccessCode       from "@/pages/AccessCode";
import Payment          from "@/pages/Payment";
import Pricing          from "@/pages/Pricing";
import Verify           from "@/pages/Verify";
import Login            from "@/pages/auth/Login";
import Register         from "@/pages/auth/Register";
import AuthCallback     from "@/pages/auth/AuthCallback";
import AdminLogin       from "@/pages/admin/AdminLogin";
import AdminDashboard   from "@/pages/admin/AdminDashboard";
import Certificate      from "@/pages/Certificate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Switch>

                  {/* Admin login — standalone, no AdminLayout */}
                  <Route path="/admin/login" component={AdminLogin} />

                  {/* All other /admin/* routes — wrapped in AdminLayout */}
                  <Route path="/admin">
                    <AdminLayout>
                      <Switch>
                        <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
                        <Route component={NotFound} />
                      </Switch>
                    </AdminLayout>
                  </Route>
                  <Route path="/admin/:rest*">
                    <AdminLayout>
                      <Switch>
                        <ProtectedRoute path="/admin/courses"      component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/users"        component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/payments"     component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/codes"        component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/analytics"    component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/certificates" component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/content"      component={AdminDashboard} adminOnly />
                        <ProtectedRoute path="/admin/announcements" component={AdminDashboard} adminOnly />
                        <Route component={NotFound} />
                      </Switch>
                    </AdminLayout>
                  </Route>

                  {/* All public / user routes — wrapped in MainLayout */}
                  <Route>
                    <MainLayout>
                      <Switch>
                        <Route path="/"                               component={Home} />
                        <Route path="/curriculum"                    component={Curriculum} />
                        <Route path="/courses"                       component={Courses} />
                        <Route path="/courses/:courseId"             component={CourseDetail} />
                        <Route path="/learn/:courseId/:lessonId"     component={Learn} />
                        <Route path="/auth/login"                    component={Login} />
                        <Route path="/auth/register"                 component={Register} />
                        <Route path="/auth/callback"                 component={AuthCallback} />
                        <Route path="/access-code"                   component={AccessCode} />
                        <Route path="/payment/:courseId"             component={Payment} />
                        <Route path="/pricing"                       component={Pricing} />
                        <Route path="/verify/:certId"                component={Verify} />
                        <Route path="/verify"                        component={Verify} />
                        <ProtectedRoute path="/certificate/:courseId" component={Certificate} />
                        <ProtectedRoute path="/my-certificates"      component={MyCertificates} />
                        <ProtectedRoute path="/dashboard"            component={Dashboard} />
                        <Route component={NotFound} />
                      </Switch>
                    </MainLayout>
                  </Route>

                </Switch>
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
