import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
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
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/simulator" element={<MortgageSimulator />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
                  <Route path="/dashboard/properties/new" element={<ProtectedRoute><NewProperty /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
