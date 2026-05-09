import { Outlet } from "react-router-dom";
import CaseworkerNavbar from "../pages/caseworker/Navbar";
import Footer from "../pages/applicant/Footer";

const CaseworkerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CaseworkerNavbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CaseworkerLayout;
