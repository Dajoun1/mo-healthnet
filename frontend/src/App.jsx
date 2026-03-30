// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import ApplicantLayout from "./layouts/ApplicantLayout";
import CaseworkerLayout from "./layouts/CaseworkerLayout";

// Public Pages
import Home from "./pages/applicant/Home";
<<<<<<< HEAD
=======
import About from "./pages/applicant/About";
>>>>>>> develop
import Signin from "./components/Signin";
import TestConnection from "./pages/applicant/TestConnection";

// Protected Pages
import ApplicantDashboard from "./pages/applicant/Dashboard";
import CaseworkerDashboard from "./pages/caseworker/Dashboard";
<<<<<<< HEAD
import ApplicationForm from "./pages/applicant/application form/ApplicationForm";
=======
>>>>>>> develop

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ApplicantLayout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<Signin />} />
<<<<<<< HEAD
            <Route path="application" element={<ApplicationForm />} />
=======
            <Route path="about" element={<About />} />
>>>>>>> develop
            <Route path="test" element={<TestConnection />} />
          </Route>

          <Route path="/signin" element={<Signin />} />

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
            {/* Will add more applicant routes here */}
          </Route>

          {/* Protected Caseworker Routes */}
          <Route
            path="/caseworker"
            element={
              <ProtectedRoute
                allowedRoles={["caseworker", "Caseworker", "employee", "Employee"]}
              >
                <CaseworkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CaseworkerDashboard />} />
            {/* Will add more caseworker routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
