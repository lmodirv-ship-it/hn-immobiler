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
import AdminPayments from "./pages/admin/Payments";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";
import RoleRequests from "./pages/admin/RoleRequests";
import DashboardBookings from "./pages/dashboard/Bookings";
import DashboardAnalytics from "./pages/dashboard/Analytics";

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
                  <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminHome /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/properties" element={<ProtectedRoute requireAdmin><AdminProperties /></ProtectedRoute>} />
                  <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
                  <Route path="/admin/role-requests" element={<ProtectedRoute requireAdmin><RoleRequests /></ProtectedRoute>} />
                  <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardBookings /></ProtectedRoute>} />
                  <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardAnalytics /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
                  <Route path="/dashboard/properties/new" element={<ProtectedRoute><NewProperty /></ProtectedRoute>} />
                  <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/dashboard/viewings" element={<ProtectedRoute><Viewings /></ProtectedRoute>} />
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
