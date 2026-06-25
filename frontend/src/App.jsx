
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RoleBasedLayout from './components/Layout/RoleBasedLayout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Home from './pages/Home';
import FindOpportunities from './pages/FindOpportunities';
import OpportunityDetails from './pages/OpportunityDetails';
import ApplyNow from './pages/ApplyNow';
import MyApplications from './pages/MyApplications';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <RoleBasedLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/opportunities" element={<FindOpportunities />} />
        <Route path="/opportunity/:id" element={<OpportunityDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        {/* Apply Now - Authentication handled inside component */}
        <Route path="/apply/:id" element={<ApplyNow />} />
        
        {/* Protected Routes */}
        <Route path="/applications" element={
          <ProtectedRoute requiredRole="student">
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="student">
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </RoleBasedLayout>
  );
}

export default App;
