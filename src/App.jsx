

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Sidebar from './components/sidebar';
import Navbar from './components/navbar';

import Dashboard from './pages/Dashboard';
import AddFacilities from './pages/Addfacilities';
import DeleteFacilities from './pages/DeleteFacilities';
import AddTests from './pages/AddTests';
import DeleteTests from './pages/DeleteTests';
import AddPackages from './pages/AddPackages';
import DeletePackages from './pages/DeletePackages';
import LoginAdmin from './pages/login';
import NotFound from './pages/NotFound';
import ViewPrescription from './pages/user-prescription/UserPrescription';
// import { UserDetails } from './pages/UsersDetails';
import CreateUserForm from './pages/user-creation/CreateUserForm';
// import { Query } from './pages/Query';
import HospitalAppointmentTable from './pages/hospital-appointment/HospitalAppointmentTable';
import UserEmailPaymentDetails from './pages/email-payment-details/EmailPayment';
import Faq from './components/Faq';
import FaqList from './components/FaqList';
import LabsLists from "./pages/LabsLists"
import CouponTable from './pages/CouponTable';
import AddCouponForm from './pages/AddCoupon';
import OrderExportTable from './pages/user-orders/UserOrders';
import AllUsers from './pages/all-users/AllUsers';
import { Query } from './pages/users-query/UsersQuery';
import InvoiceTable from './pages/user-invoices/UserInvoices';
import RadiologyFacilities from './pages/radiologyBooking/radiology-facilities';
import BookTestForUser from './components/BookTestForUsers';
import RadiologyBooking from './pages/radiologyBookingTable/RadiologyBooking';
import RadiologyAppointments from './pages/radiologyAppointments/RadiologyAppointments';
import GenerateINV from "./pages/generate-invoice/GenerateINV"
import TaxInvoiceTable from "./pages/tax-invoices/Tax-invoices-table"
import AllInvoices from "./pages/All-Invoices/All-Invoices"
import { fetchProtectedData } from './utils/adminAuth';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, isuserLogin } from './Redux/reducer';
import RegistrationFormForCGHS from './pages/user-creation/Create-CGHS-user';
import LeadTable from './pages/crm/LeadTable';
import LeadForm from './pages/crm/LeadForm';
import AllLeads from './pages/crm/AllLeads';
const isAuthenticated = () => {
  const isUserLoggedIn = useSelector(isLoggedIn)
  if(isUserLoggedIn){
    return true
  }else{
    return false
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const   PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'dashboard';
  });

  const dispatch = useDispatch()
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    localStorage.setItem('activeMenu', activeMenu);
     const fetchUserDetails = async () => {
      try {
       const response=  await fetchProtectedData("https://api.swasthyapro.com/api/auth/me");
       if(response.message !== "Invalid or expired token"){
        dispatch(isuserLogin());
       }
      } catch (error) {
        console.error("Auth check failed", error);
      }
    };
    fetchUserDetails();
  }, [activeMenu]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginAdmin />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-facilities"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddFacilities />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/coupon-list"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <CouponTable />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/add-coupon"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddCouponForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-facilities"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <DeleteFacilities />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-tests"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddTests />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/edit-tests/:id"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddTests />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/add-Faq"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <Faq />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/list-FAQ"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <FaqList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-tests"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <DeleteTests />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/list-labs"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <LabsLists />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-packages/:id"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddPackages />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/add-packages"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AddPackages />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-packages"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <DeletePackages />
              </Layout>
            </ProtectedRoute>
            
          }
        />
         <Route
          path="/view-prescriptions"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <ViewPrescription/>
              </Layout>
            </ProtectedRoute>
          }
        />
              <Route
          path="/all-users"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                {/* <UserDetails/> */}
                <AllUsers/>
              </Layout>
            </ProtectedRoute>
          }
        />
            <Route
          path="/user-orders"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
              
                <OrderExportTable/>
              </Layout>
            </ProtectedRoute>
          }
        />

           <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <CreateUserForm />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/create-CGHS-user"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <RegistrationFormForCGHS />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/book-test"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <BookTestForUser />
              </Layout>
            </ProtectedRoute>
          }
        />
           <Route
          path="/book-radiology"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <RadiologyFacilities />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/hospital-appointment"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <HospitalAppointmentTable/>
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/user-Query"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                {/* <Query /> */}
                <Query/>
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/user-invoices"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                {/* <InvoiceTable/> */}
                {/* <InvoiceTable/> */}
                <AllInvoices/>
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/radiology-orders"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <RadiologyBooking/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/radiology-appointments"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <RadiologyAppointments/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/email-payments"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <UserEmailPaymentDetails/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/generate-invoices"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <GenerateINV/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/lead-crm"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <AllLeads/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/create-lead"
          element={
            <ProtectedRoute>
              <Layout
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <LeadForm/>
                
              </Layout>
            </ProtectedRoute>
          }
        />
        
         
          <Route path="*" element={<NotFound   />} />
      </Routes>
    </Router>
  );
}

const Layout = ({ children, activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
    {/* Sidebar */}
    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    />
    
    {/* Main Content Area */}
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {children}
      </main>
    </div>
  </div>
  
  );
};

export default App;


