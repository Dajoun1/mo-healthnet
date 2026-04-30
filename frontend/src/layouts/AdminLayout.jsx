import { Outlet } from "react-router-dom";
import AdminNavbar from "../pages/admin/Navbar";
import Footer from "../pages/applicant/Footer";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
