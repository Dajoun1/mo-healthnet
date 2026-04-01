// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import ApplicantLayout from "./layouts/ApplicantLayout";
import CaseworkerLayout from "./layouts/CaseworkerLayout";

// Public Pages
import Home from "./pages/applicant/Home";
import About from "./pages/applicant/About";
import Signin from "./components/Signin";
import TestConnection from "./pages/applicant/TestConnection";

// Protected Pages
import ApplicantDashboard from "./pages/applicant/Dashboard";
import CaseworkerDashboard from "./pages/caseworker/Dashboard";
import ApplicationForm from "./pages/applicant/application form/ApplicationForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ApplicantLayout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<Signin />} />
            <Route path="test" element={<TestConnection />} />
          </Route>

          <Route path="application" element={<ApplicationForm />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/applicant/complete-profile"
            element={<CompleteProfile />}
          />

          {/* Protected Applicant Routes */}
          <Route
            path="/applicant"
            element={
              <ProtectedRoute allowedRoles={["applicant", "Applicant"]}>
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ApplicantDashboard />} />
            <Route path="application" element={<ApplicationForm />} />
          </Route>

          {/* Protected Caseworker Routes */}
          <Route
            path="/caseworker"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "caseworker",
                  "Caseworker",
                  "employee",
                  "Employee",
                ]}
              >
                <CaseworkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CaseworkerDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
