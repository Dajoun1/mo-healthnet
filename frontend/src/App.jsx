// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import ApplicantLayout from "./layouts/ApplicantLayout";
import CaseworkerLayout from "./layouts/CaseworkerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/applicant/Home";
import About from "./pages/applicant/About";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

// Protected Pages
import CaseworkerDashboard from "./pages/caseworker/Dashboard";
import NotesManagement from "./pages/caseworker/NotesManagement";
import AdminDashboard from "./pages/admin/Dashboard";
import ApplicantDashboard from "./pages/applicant/Dashboard";
import Notes from "./pages/applicant/Notes";
import ApplicationForm from "./pages/applicant/application form/ApplicationForm";
import ActionCards from "./pages/applicant/ActionCards";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ApplicantLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Applicant Routes */}
          <Route
            path="/applicant"
            element={
              <ProtectedRoute allowedRoles={["Applicant"]}>
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ActionCards />} />
            <Route path="applications" element={<ApplicantDashboard />} />
            <Route path="application" element={<ApplicationForm />} />
            <Route path="notes" element={<Notes />} />
          </Route>

          {/* Protected Caseworker Routes */}
          <Route
            path="/caseworker"
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
                <CaseworkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CaseworkerDashboard />} />
            <Route path="notes" element={<NotesManagement />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
