import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import UploadPrescription from './components/prescription/UploadPrescription';
import Navbar from './components/Navbar';
import PrescriptionStatus from './components/prescription/PrescriptionStatus';
import BrowseMedicines from './components/medicines/BrowseMedicines';
// import CartPage from './components/cart/CartPage';
import OrderConfirmation from './components/order/OrderConfirmation';
import HomePage from './components/HomePage';
import { CartProvider } from './context/CartContext';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderSuccess from './components/checkout/OrderSuccess';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-prescription" 
                element={
                  <ProtectedRoute>
                    <UploadPrescription />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
              <Route 
                path="/prescription-status/:id" 
                element={
                  <ProtectedRoute>
                    <PrescriptionStatus />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/browse-medicines" 
                element={
                  <ProtectedRoute>
                    <BrowseMedicines />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/order-confirmation/:id" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } 
                />
            </Routes>
          </div>
        </div>
      </Router>
       </CartProvider>
    </AuthProvider>
  );
}

export default App;