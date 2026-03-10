import { Outlet } from "react-router-dom";
import Navbar from "../pages/applicant/Navbar";
import Footer from "../pages/applicant/Footer";
const ApplicantLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow "> {/* pt-16 accounts for fixed navbar height */}
        <Outlet /> {/* This renders the current page content */}
      </main>
      <Footer />
    </div>
  );
};

export default ApplicantLayout;