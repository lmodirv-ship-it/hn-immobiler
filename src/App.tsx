import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MortgageSimulator from "./pages/MortgageSimulator";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import MyProperties from "./pages/MyProperties";
import NewProperty from "./pages/NewProperty";
import MapView from "./pages/MapView";
import Messages from "./pages/Messages";
import Viewings from "./pages/Viewings";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import AdminPayments from "./pages/admin/Payments";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminFinance from "./pages/admin/Finance";
import AdminMaintenance from "./pages/admin/Maintenance";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";
import AdminAuditLog from "./pages/admin/AuditLog";
import RoleRequests from "./pages/admin/RoleRequests";
import DashboardBookings from "./pages/dashboard/Bookings";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import DashboardInvoices from "./pages/dashboard/Invoices";
import DashboardMaintenance from "./pages/dashboard/Maintenance";
import BookingChat from "./pages/BookingChat";
import NotificationBridge from "@/components/NotificationBridge";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerOverview from "./pages/owner/Overview";
import OwnerProperties from "./pages/owner/Properties";
import OwnerBookings from "./pages/owner/Bookings";
import OwnerCalendar from "./pages/owner/Calendar";
import OwnerReviews from "./pages/owner/Reviews";
import OwnerPayouts from "./pages/owner/Payouts";
import OwnerSettings from "./pages/owner/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CurrencyProvider>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationBridge />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<PropertyList />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/simulator" element={<MortgageSimulator />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout/:planId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="finance" element={<AdminFinance />} />
                    <Route path="maintenance" element={<AdminMaintenance />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="role-requests" element={<RoleRequests />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="audit" element={<AdminAuditLog />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardBookings /></ProtectedRoute>} />
                  <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardAnalytics /></ProtectedRoute>} />
                  <Route path="/dashboard/invoices" element={<ProtectedRoute><DashboardInvoices /></ProtectedRoute>} />
                  <Route path="/dashboard/maintenance" element={<ProtectedRoute><DashboardMaintenance /></ProtectedRoute>} />
                  <Route path="/bookings/:id/chat" element={<ProtectedRoute><BookingChat /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
                  <Route path="/dashboard/properties/new" element={<ProtectedRoute><NewProperty /></ProtectedRoute>} />
                  <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/dashboard/viewings" element={<ProtectedRoute><Viewings /></ProtectedRoute>} />
                  <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<OwnerOverview />} />
                    <Route path="properties" element={<OwnerProperties />} />
                    <Route path="properties/new" element={<NewProperty />} />
                    <Route path="bookings" element={<OwnerBookings />} />
                    <Route path="calendar" element={<OwnerCalendar />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="reviews" element={<OwnerReviews />} />
                    <Route path="analytics" element={<DashboardAnalytics />} />
                    <Route path="invoices" element={<DashboardInvoices />} />
                    <Route path="maintenance" element={<DashboardMaintenance />} />
                    <Route path="payouts" element={<OwnerPayouts />} />
                    <Route path="settings" element={<OwnerSettings />} />
                  </Route>
                  <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
