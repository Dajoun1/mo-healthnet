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
import AdminDashboard from "./pages/admin/Dashboard";
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
              <ProtectedRoute allowedRoles={["APPLICANT"]}>
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ActionCards />} />
            <Route path="application" element={<ApplicationForm />} />
          </Route>

          {/* Protected Caseworker Routes */}
          <Route
            path="/caseworker"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <CaseworkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CaseworkerDashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
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
