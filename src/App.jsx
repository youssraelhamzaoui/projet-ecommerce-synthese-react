import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';

import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import ProfilePage       from './pages/ProfilePage';
import OrdersPage        from './pages/OrdersPage';
import ContactPage       from './pages/ContactPage';
import CategoriesPage    from './pages/CategoriesPage';
import BrandsPage        from './pages/BrandsPage';

function WithLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth pages — no header/footer */}
            <Route path="/connexion"   element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />

            {/* Public pages with layout */}
            <Route path="/"              element={<WithLayout><HomePage /></WithLayout>} />
            <Route path="/produits"      element={<WithLayout><ProductsPage /></WithLayout>} />
            <Route path="/produits/:id"  element={<WithLayout><ProductDetailPage /></WithLayout>} />
            <Route path="/panier"        element={<WithLayout><CartPage /></WithLayout>} />
            <Route path="/categories"    element={<WithLayout><CategoriesPage /></WithLayout>} />
            <Route path="/marques"       element={<WithLayout><BrandsPage /></WithLayout>} />
            <Route path="/contact"       element={<WithLayout><ContactPage /></WithLayout>} />

            {/* Protected pages */}
            <Route path="/commande"  element={<WithLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></WithLayout>} />
            <Route path="/profil"    element={<WithLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></WithLayout>} />
            <Route path="/commandes" element={<WithLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></WithLayout>} />
          </Routes>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
