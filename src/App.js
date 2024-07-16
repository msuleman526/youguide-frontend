import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import OTPScreen from './pages/OTPScreen'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './layouts/DashboardLayout'
import Transaction from './pages/Transaction'
import Members from './pages/Members'
import Payment from './pages/Payment'
import ForgetPassword from './pages/ForgetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Upload from './pages/Upload'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPScreen />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/members" element={<Members />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/reports-by-month" element={<Reports />} />
          <Route path="/reports-by-month-compare" element={<Reports />} />
          <Route path="/reports-by-category" element={<Reports />} />
          <Route path="/reports-by-category-group" element={<Reports />} />
          <Route path="/reports-by-year" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
