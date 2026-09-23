import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import TravelerLayout from '../layouts/TravelerLayout';
import AdminLayout from '../layouts/AdminLayout';
import PartnerLayout from '../layouts/PartnerLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

// Lazy Loaded Pages - Public
const Home = lazy(() => import('../pages/public/Home'));
const Destinations = lazy(() => import('../pages/public/Destinations'));
const DestinationDetails = lazy(() => import('../pages/public/DestinationDetails'));
const Articles = lazy(() => import('../pages/public/Articles'));
const ArticleDetails = lazy(() => import('../pages/public/ArticleDetails'));
const Businesses = lazy(() => import('../pages/public/Businesses'));
const PublicBusinessDetails = lazy(() => import('../pages/public/BusinessDetails'));
const Contact = lazy(() => import('../pages/public/Contact'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));
const Loading = lazy(() => import('../pages/public/Loading'));
const NotFound = lazy(() => import('../pages/public/NotFound'));

// Lazy Loaded Pages - Auth
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Lazy Loaded Pages - Tourist
const Dashboard = lazy(() => import('../pages/tourist/dashboard/Dashboard'));
const Profile = lazy(() => import('../pages/tourist/profile/Profile'));
const Settings = lazy(() => import('../pages/tourist/settings/Settings'));
const MyTripRequests = lazy(() => import('../pages/tourist/tripRequests/MyTripRequests'));
const TripRequestForm = lazy(() => import('../pages/tourist/tripRequests/TripRequestForm'));
const ProposalDetails = lazy(() => import('../pages/tourist/proposals/ProposalDetails'));
const Bookings = lazy(() => import('../pages/tourist/bookings/Bookings'));
const Notifications = lazy(() => import('../pages/tourist/notifications/Notifications'));

// Lazy Loaded Pages - Partner
const PartnerDashboard = lazy(() => import('../pages/partner/dashboard/PartnerDashboard'));
const PartnerKyc = lazy(() => import('../pages/partner/kyc/PartnerKyc'));
const MyBusinesses = lazy(() => import('../pages/partner/businesses/MyBusinesses'));
const BusinessForm = lazy(() => import('../pages/partner/businesses/BusinessForm'));
const BusinessDetails = lazy(() => import('../pages/partner/businesses/BusinessDetails'));
const PartnerInquiries = lazy(() => import('../pages/partner/inquiries/PartnerInquiries'));
const PartnerInquiryDetails = lazy(() => import('../pages/partner/inquiries/PartnerInquiryDetails'));
const PartnerRooms = lazy(() => import('../pages/partner/rooms/PartnerRooms'));
const PartnerVehicles = lazy(() => import('../pages/partner/vehicles/PartnerVehicles'));
const PartnerEquipment = lazy(() => import('../pages/partner/equipment/PartnerEquipment'));
const PartnerCalendar = lazy(() => import('../pages/partner/calendar/PartnerCalendar'));
const PartnerFinances = lazy(() => import('../pages/partner/finances/PartnerFinances'));
const PartnerBookings = lazy(() => import('../pages/partner/bookings/PartnerBookings'));
const PartnerNotifications = lazy(() => import('../pages/partner/notifications/PartnerNotifications'));

// Lazy Loaded Pages - Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminKyc = lazy(() => import('../pages/admin/AdminKyc'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminDestinations = lazy(() => import('../pages/admin/AdminDestinations'));
const AdminResorts = lazy(() => import('../pages/admin/AdminResorts'));
const AdminInquiries = lazy(() => import('../pages/admin/AdminInquiries'));
const AdminTripRequests = lazy(() => import('../pages/admin/AdminTripRequests'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminArticles = lazy(() => import('../pages/admin/AdminArticles'));
const AdminBusinesses = lazy(() => import('../pages/admin/AdminBusinesses'));
const AdminBusinessDetails = lazy(() => import('../pages/admin/AdminBusinessDetails'));

const FallbackLoader = () => <LoadingSpinner message="Loading..." />;

export const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetails />} />
          <Route path="/resorts" element={<Navigate to="/businesses?type=RESORT" replace />} />
          <Route path="/resorts/:slug" element={<PublicBusinessDetails />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetails />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:slug" element={<PublicBusinessDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Traveler/Tourist Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TOURIST', 'ADMIN']} />}>
          <Route element={<TravelerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/requests" element={<MyTripRequests />} />
            <Route path="/dashboard/proposals/:id" element={<ProposalDetails />} />
            <Route path="/dashboard/bookings" element={<Bookings />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/trip-request/new" element={<TripRequestForm />} />
          </Route>
        </Route>

        {/* Protected Business Partner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BUSINESS_PARTNER', 'ADMIN']} />}>
          <Route element={<PartnerLayout />}>
            <Route path="/partner" element={<PartnerDashboard />} />
            <Route path="/partner/kyc" element={<PartnerKyc />} />
            <Route path="/partner/businesses" element={<MyBusinesses />} />
            <Route path="/partner/businesses/new" element={<BusinessForm />} />
            <Route path="/partner/businesses/:id/edit" element={<BusinessForm />} />
            <Route path="/partner/businesses/:id" element={<BusinessDetails />} />
            <Route path="/partner/rooms" element={<PartnerRooms />} />
            <Route path="/partner/vehicles" element={<PartnerVehicles />} />
            <Route path="/partner/equipment" element={<PartnerEquipment />} />
            <Route path="/partner/calendar" element={<PartnerCalendar />} />
            <Route path="/partner/finances" element={<PartnerFinances />} />
            <Route path="/partner/bookings" element={<PartnerBookings />} />
            <Route path="/partner/inquiries" element={<PartnerInquiries />} />
            <Route path="/partner/inquiries/:id" element={<PartnerInquiryDetails />} />
            <Route path="/partner/notifications" element={<PartnerNotifications />} />
            <Route path="/partner/profile" element={<Profile />} />
            <Route path="/partner/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/kyc" element={<AdminKyc />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/destinations" element={<AdminDestinations />} />
            <Route path="/admin/resorts" element={<AdminResorts />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/trip-requests" element={<AdminTripRequests />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/businesses" element={<AdminBusinesses />} />
            <Route path="/admin/businesses/:id" element={<AdminBusinessDetails />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
