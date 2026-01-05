import React, { useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import OTPScreen from './pages/OTPScreen'
import DashboardLayout from './layouts/DashboardLayout'
import SetNewPassword from './pages/SetNewPassword'
import ForgotPassword from './pages/ForgetPassword'
import Roles from './pages/Roles/Roles'
import Users from './pages/Users/Users'
import Books from './pages/Books/Books'
import Categories from './pages/Categories/Categories'
import VendorManagement from './pages/Vendors/VendorManagement'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import PaymentError from './pages/Payment/PaymentError'
import PdfGuideSuccess from './pages/Payment/PdfGuideSuccess'
import Transactions from './pages/Transactions/Transactions'
import SubscriptionGuides from './pages/Vendors/SubscriptionGuides'
import PdfViewer from './pages/Vendors/PdfViewer'
import ContractExpired from './pages/Vendors/SubscriptionExpire'
import DeleteAccount from './pages/DeleteAccount'
import GuidePreview from './pages/Payment/GuidePreview'
import AffiliateManagement from './pages/Affiliate/AffiliateManagement'
import AffiliateSubscriptionGuides from './pages/Affiliate/AffiliateSubscriptionGuides'
import PdfAffiliateViewer from './pages/Affiliate/PdfAffiliateViewer'
import HotelManagement from './pages/Affiliate/HotelManagement'
import HotelSubscriptionGuides from './pages/Affiliate/HotelSubscriptionGuides'
import PdfHotelViewer from './pages/Affiliate/PdfHotelViewer'
import AffiliateDashboard from './pages/Affiliate/AffiliateDashboard'
import AffiliateHotelManagement from './pages/Affiliate/AffiliateHotelManagement'
import FeatureTestPage from './pages/FeatureTestPage'
import AffiliateLayout from './layouts/AffiliateLayout'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import VideoGenerator from './pages/VideoGenerator'
import PDFGenerator from './pages/PDFGenerator'
import Teams from './pages/Teams'
import PrivacyPolicy from './pages/PrivacyPolicy'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/affiliate-login" element={<Login />} /> {/* Unified login for affiliates too */}
        <Route path="/travel-guides/:id" element={<GuidePreview />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentError />} />
        <Route path="/guide-success/pdf" element={<PdfGuideSuccess />} />
        <Route path="/account/remove" element={<DeleteAccount />} />
        <Route path="/subscription-expired" element={<ContractExpired />} />
        <Route path="/subscription-guides/:id" element={<SubscriptionGuides />} />
        <Route path="/affiliate-guides/:id" element={<AffiliateSubscriptionGuides />} />
        <Route path="/hotel-guides/:affiliateId/:hotelId" element={<HotelSubscriptionGuides />} />
        <Route path="/view-content/:affilate/:id" element={<PdfViewer />} />
        <Route path="/view-affiliate-content/:affilate/:id" element={<PdfAffiliateViewer />} />
        <Route path="/view-hotel-content/:affiliateId/:hotelId/:id" element={<PdfHotelViewer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPScreen />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/generate-video/:tripId" element={<VideoGenerator />} />
        <Route path="/generate-pdf/:tripId" element={<PDFGenerator />} />

        <Route element={<ProtectedRoute type="admin"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/affiliates" element={<AffiliateManagement />} />
          <Route path="/hotel-management/:affiliateId" element={<HotelManagement />} />
          <Route path="/feature-test" element={<FeatureTestPage />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/books" element={<Books />} />
        </Route>

        {/* Affiliate Layout Routes */}
        <Route element={<ProtectedRoute type="affiliate"><AffiliateLayout /></ProtectedRoute>}>
          <Route path="/affiliate-dashboard/:affiliateId" element={<AffiliateDashboard />} />
          <Route path="/affiliate-hotels/:affiliateId" element={<AffiliateHotelManagement />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
