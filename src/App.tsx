
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DomainDetail from "./pages/DomainDetail";
import TaskDetail from "./pages/TaskDetail";
import JsonView from "./pages/JsonView";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import DomainAllocation from "./pages/DomainAllocation";
import UserTimeline from "./pages/UserTimeline";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/domain/:domainName" 
            element={
              <ProtectedRoute>
                <DomainDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/domain/:domainName/task/:taskName" 
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/json-view" 
            element={
              <ProtectedRoute>
                <JsonView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/domain-allocation" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <DomainAllocation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-timeline" 
            element={
              <ProtectedRoute>
                <UserTimeline />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
