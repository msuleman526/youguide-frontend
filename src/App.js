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
import DigitalGuideSuccess from './pages/Payment/DigitalGuideSuccess'
import QuotaPurchaseSuccess from './pages/Payment/QuotaPurchaseSuccess'
import HtmlViewer from './pages/Payment/HtmlViewer'
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
import AffiliateApiAccessDashboard from './pages/Affiliate/AffiliateApiAccessDashboard'
import AffiliateApiAccessList from './pages/Affiliate/AffiliateApiAccessList'
import FeatureTestPage from './pages/FeatureTestPage'
import AffiliateLayout from './layouts/AffiliateLayout'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import VideoGenerator from './pages/VideoGenerator'
import PDFGenerator from './pages/PDFGenerator'
import Teams from './pages/Teams'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RequestForm from './pages/RequestForm'
import AllRequests from './pages/Requests/AllRequests'
import ContactForm from './pages/ContactForm'
import AllContacts from './pages/Contact/AllContacts'
import AllNewsletters from './pages/Newsletter/AllNewsletters'
import ApiAccessDashboard from './pages/ApiAccess/ApiAccessDashboard'
import ApiAccessList from './pages/ApiAccess/ApiAccessList'
import ApiDocumentation from './pages/ApiDocumentation/ApiDocumentation'
import Unauthorized from './pages/Unauthorized/Unauthorized'
import LanguageGuides from './pages/LanguageGuides/LanguageGuides'
import Coupons from './pages/Coupons/Coupons'
import Discounts from './pages/Discounts/Discounts'
import AmazonPurchases from './pages/AmazonPurchases/AmazonPurchases'
import VerifyAmazonOrder from './pages/VerifyAmazonOrder/VerifyAmazonOrder'
import FreeGuide from './pages/FreeGuide/FreeGuide'
import OrderSuccess from './pages/Affiliate/OrderSuccess'
import MyEarnings from './pages/Affiliate/MyEarnings'
import SubAffiliates from './pages/Affiliate/SubAffiliates'
import LinkApprovalQueue from './pages/Admin/LinkApprovalQueue'
import ApiAccessRequestQueue from './pages/Admin/ApiAccessRequestQueue'
import AdminPayouts from './pages/Admin/AdminPayouts'
import AdminEarningsReport from './pages/Admin/AdminEarningsReport'
import WebsiteOrders from './pages/WebsiteOrders/WebsiteOrders'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/affiliate-login" element={<Login />} /> {/* Unified login for affiliates too */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/travel-guides/:id" element={<GuidePreview />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/request-form" element={<RequestForm />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/api-documentation" element={<ApiDocumentation />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentError />} />
        <Route path="/guide-success/pdf" element={<PdfGuideSuccess />} />
        <Route path="/guide-success/digital" element={<DigitalGuideSuccess />} />
        <Route path="/quota-purchase-success" element={<QuotaPurchaseSuccess />} />
        <Route path="/html-viewer/:token" element={<HtmlViewer />} />
        <Route path="/account/remove" element={<DeleteAccount />} />
        <Route path="/subscription-expired" element={<ContractExpired />} />
        <Route path="/subscription-guides/:id" element={<SubscriptionGuides />} />
        <Route path="/affiliate-guides/:id" element={<AffiliateSubscriptionGuides />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/hotel-guides/:affiliateId/:hotelId" element={<HotelSubscriptionGuides />} />
        <Route path="/view-content/:affilate/:id" element={<PdfViewer />} />
        <Route path="/view-affiliate-content/:affilate/:id" element={<PdfAffiliateViewer />} />
        <Route path="/view-hotel-content/:affiliateId/:hotelId/:id" element={<PdfHotelViewer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPScreen />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/verify-amazon-order" element={<VerifyAmazonOrder />} />
        <Route path="/free-guide/:orderNumber" element={<FreeGuide />} />
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
          <Route path="/language-guides" element={<LanguageGuides />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/all-requests" element={<AllRequests />} />
          <Route path="/all-contacts" element={<AllContacts />} />
          <Route path="/newsletters" element={<AllNewsletters />} />
          <Route path="/amazon-purchases" element={<AmazonPurchases />} />
          <Route path="/website-orders" element={<WebsiteOrders />} />
          <Route path="/api-access/dashboard" element={<ApiAccessDashboard />} />
          <Route path="/api-access/list" element={<ApiAccessList />} />
          <Route path="/link-approvals" element={<LinkApprovalQueue />} />
          <Route path="/api-access-approvals" element={<ApiAccessRequestQueue />} />
          <Route path="/admin-payouts" element={<AdminPayouts />} />
          <Route path="/admin-earnings-report" element={<AdminEarningsReport />} />
        </Route>

        {/* Affiliate Layout Routes */}
        <Route element={<ProtectedRoute type="affiliate"><AffiliateLayout /></ProtectedRoute>}>
          <Route path="/affiliate-dashboard/:affiliateId" element={<AffiliateDashboard />} />
          <Route path="/affiliate-hotels/:affiliateId" element={<AffiliateHotelManagement />} />
          <Route path="/affiliate-api-access/:affiliateId" element={<AffiliateApiAccessDashboard />} />
          <Route path="/affiliate-api-access-list/:affiliateId" element={<AffiliateApiAccessList />} />
          <Route path="/affiliate-my-earnings/:affiliateId" element={<MyEarnings />} />
          <Route path="/affiliate-sub-affiliates/:affiliateId" element={<SubAffiliates />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
