# YouGuide - QR Code & Hotel Features Implementation

## 🚀 Quick Start

### Install Dependencies
```bash
cd youguide-frontend
npm install qrcode.react
```

### Start the Application
```bash
# Backend
cd youguide-backend
npm start

# Frontend
cd youguide-frontend
npm start
```

## ✨ New Features Implemented

### 1. QR Code Column in Affiliates List
- **Location**: `http://localhost:3000/#/affiliates`
- **Feature**: Real-time QR code generation for each affiliate
- **QR Code Content**: `http://localhost:3000/#/affiliate-guides/{affiliateId}`
- **Behavior**: Scanning opens the affiliate's guide page

### 2. Hotel/Sub-Affiliates System

#### Hotel Management (Admin)
- **URL**: `http://localhost:3000/#/hotel-management/{affiliateId}`
- **Access**: Admin only
- **Features**: 
  - View default affiliate link
  - Add/Edit/Delete hotels
  - QR codes for hotel-specific links
  - Categories limited to affiliate's categories

#### Affiliate Authentication & Dashboard
- **Login**: `http://localhost:3000/#/affiliate-login`
- **Dashboard**: `http://localhost:3000/#/affiliate-dashboard/{affiliateId}`
- **Access**: Affiliates with `isLogin: true`
- **Features**:
  - View subscription status and pending clicks
  - Manage own hotels
  - Hotel QR code generation

#### Hotel Guide Pages
- **URL**: `http://localhost:3000/#/hotel-guides/{affiliateId}/{hotelId}`
- **Features**:
  - Hotel logo in header/footer
  - "Affiliate By" section with affiliate logo
  - Hotel's primary color scheme
  - Same functionality as affiliate guides

#### Content Viewing
- **URL**: `http://localhost:3000/#/view-hotel-content/{affiliateId}/{hotelId}/{bookId}`
- **Features**:
  - Hotel-branded PDF viewer
  - Clicks deducted from affiliate's pending clicks
  - Hotel and affiliate logos in footer

## 🧪 Testing Guide

### Test QR Code Feature
1. Go to `http://localhost:3000/#/affiliates`
2. Log in as admin
3. Verify QR code column appears in affiliates table
4. Scan QR code with phone - should open affiliate guide page

### Test Hotel Management (Admin)
1. Go to affiliates list
2. Click hotel icon (🏨) for any affiliate
3. Should open hotel management page
4. Try adding a new hotel
5. Verify QR code generates for new hotel
6. Click eye icon to open hotel guide page

### Test Affiliate Login & Hotel Management
1. Create an affiliate with `isLogin: true` and linked `userId`
2. Go to `http://localhost:3000/#/affiliate-login`
3. Login with the user credentials linked to affiliate
4. Should redirect to affiliate dashboard
5. Try adding/managing hotels from affiliate dashboard

### Test Hotel Guide Pages
1. Access `http://localhost:3000/#/hotel-guides/{affiliateId}/{hotelId}`
2. Verify hotel logo appears in header
3. Check that hotel's primary color is used
4. Verify "Affiliate By" section in footer
5. Test opening a guide - should deduct from affiliate clicks

## ⚠️ Important Notes

1. **QR Code Library**: Must install `qrcode.react` for QR functionality
2. **Click Inheritance**: All hotel operations affect affiliate's click count
3. **Category Validation**: Hotels can only use affiliate's assigned categories
4. **Logo Upload**: Uses existing S3/Wasabi infrastructure
5. **No Breaking Changes**: All existing functionality preserved
