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
import AIChat           from "@/pages/AIChat";
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
import About            from "@/pages/About";
import Contact          from "@/pages/Contact";
import Leaderboard      from "@/pages/Leaderboard";
import Login            from "@/pages/auth/Login";
import Register         from "@/pages/auth/Register";
import ForgotPassword   from "@/pages/auth/ForgotPassword";
import AuthCallback     from "@/pages/auth/AuthCallback";
import AdminDashboard   from "@/pages/admin/AdminDashboard";
import AdminSettings    from "@/pages/admin/AdminSettings";
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
      <div style={{ visibility: splashDone ? "visible" : "hidden" }}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Switch>

                  {/* Auth callback — standalone, no layout */}
                  <Route path="/auth/callback" component={AuthCallback} />

                  {/* Admin routes — open, no login required */}
                  <Route path="/management-portal">
                    <AdminLayout>
                      <Switch>
                        <Route path="/management-portal" component={AdminDashboard} />
                        <Route component={NotFound} />
                      </Switch>
                    </AdminLayout>
                  </Route>
                  <Route path="/management-portal/:rest*">
                    <AdminLayout>
                      <Switch>
                        <Route path="/management-portal/courses"       component={AdminDashboard} />
                        <Route path="/management-portal/users"         component={AdminDashboard} />
                        <Route path="/management-portal/payments"      component={AdminDashboard} />
                        <Route path="/management-portal/codes"         component={AdminDashboard} />
                        <Route path="/management-portal/analytics"     component={AdminDashboard} />
                        <Route path="/management-portal/certificates"  component={AdminDashboard} />
                        <Route path="/management-portal/content"       component={AdminDashboard} />
                        <Route path="/management-portal/announcements" component={AdminDashboard} />
                        <Route path="/management-portal/settings"      component={AdminSettings} />
                        <Route component={NotFound} />
                      </Switch>
                    </AdminLayout>
                  </Route>

                  {/* All public / user routes */}
                  <Route>
                    <MainLayout>
                      <Switch>
                        <Route path="/"                               component={Home} />
                        <Route path="/curriculum"                    component={Curriculum} />
                        <Route path="/courses"                       component={Courses} />
                        <Route path="/courses/:courseId"             component={CourseDetail} />
                        <Route path="/learn/:courseId/:lessonId"     component={Learn} />
                        <Route path="/about"                         component={About} />
                        <Route path="/contact"                       component={Contact} />
                        <Route path="/leaderboard"                   component={Leaderboard} />
                        <Route path="/auth/login"                    component={Login} />
                        <Route path="/auth/register"                 component={Register} />
                        <Route path="/auth/forgot-password"          component={ForgotPassword} />
                        <Route path="/access-code"                   component={AccessCode} />
                        <Route path="/payment/:courseId"             component={Payment} />
                        <Route path="/ai-tutor"                      component={AIChat} />
                        <Route path="/pricing"                       component={Pricing} />
                        <Route path="/verify/:certId"                component={Verify} />
                        <Route path="/verify"                        component={Verify} />
                        <ProtectedRoute path="/certificate/:courseId" component={Certificate} />
                        <ProtectedRoute path="/my-certificates"       component={MyCertificates} />
                        <ProtectedRoute path="/dashboard"             component={Dashboard} />
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
      </div>
    </>
  );
}

export default App;
