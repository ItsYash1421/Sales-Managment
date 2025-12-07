# Retail Sales Management System

A full-stack web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built to handle 100,000+ transaction records with MongoDB Atlas.

## Live Demo

**Frontend (Vercel):** https://sales-managment-frontend.vercel.app/

**Backend API (Render):** https://sales-managment-wju9.onrender.com

## Overview
Professional-grade sales management system demonstrating modern software engineering practices. Features real-time search, multi-select filtering, responsive UI, and optimized backend data processing with MongoDB integration.

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.0.8
- Axios 1.6.2
- CSS3 with custom properties

### Backend
- Node.js (>=18)
- Express.js 4.18.2
- MongoDB 7.0.0
- CORS 2.8.5

### Database
- MongoDB Atlas (Cloud)
- 100,000 sales records
- Indexed queries for performance

## Search Implementation Summary
Full-text case-insensitive search across Customer Name, Phone Number, Customer ID, and Product ID fields. Frontend implements 300ms debouncing to minimize API calls. Backend uses MongoDB regex queries for efficient searching. Search operates seamlessly alongside active filters and sorting.

## Filter Implementation Summary
Multi-select filtering for categorical data (Customer Region, Gender, Product Category, Tags, Payment Method) using checkbox groups. Range-based filtering for Age (min/max inputs) and Date (date pickers). Filters applied sequentially using JavaScript array filter operations. All filters work independently and in combination, with state preserved across pagination.

## Sorting Implementation Summary
Six sorting options: Date (newest/oldest first), Quantity (high/low), Customer Name (A-Z/Z-A). Implemented using JavaScript native sort with custom comparators. Default sort is Date descending (newest first). Sorting maintains active search and filter states, executed after filtering but before pagination.

## Pagination Implementation Summary
Page-based navigation with 10 items per page. Displays intelligent page numbers with ellipsis for large page counts (1 ... 5 6 7 ... 100). Previous/Next buttons with disabled states. Pagination metadata includes totalRecords, totalPages, currentPage, and pageSize. Resets to page 1 when filters change to prevent empty results.

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (free tier)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd truestate
```

2. Install root dependencies
```bash
npm install
```

3. Install workspace dependencies (backend + frontend)
```bash
npm install --workspaces
```

### Configuration

1. Backend `.env` file (create at `backend/.env`):
```env
PORT=8001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Salesmanagement
NODE_ENV=development
```

2. Frontend `.env` file (create at `frontend/.env`):
```env
VITE_API_URL=http://localhost:8001/api
```

### Database Setup

Import CSV data to MongoDB (100,000 records):
```bash
cd backend/scripts
node importData.js
```

### Running the Application

#### Development Mode (Both Servers)
```bash
npm run dev
```
- Backend runs on: http://localhost:8001
- Frontend runs on: http://localhost:5173

#### Production Mode

Build frontend:
```bash
cd frontend
npm run build
```

Start backend:
```bash
cd backend
npm start
```

## Deployment

### Deploy to Render (Recommended)

1. Push code to GitHub
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

2. Connect GitHub to Render and deploy using Blueprint (`render.yaml`)

3. Set environment variables on Render:
   - Backend: `MONGODB_URI`, `NODE_ENV=production`
   - Frontend: `VITE_API_URL=https://your-backend.onrender.com/api`

See `RENDER_DEPLOY.md` for detailed deployment guide.

## Project Structure

```
truestate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── salesController.js   # Route controllers
│   │   ├── services/
│   │   │   └── mongoDataService.js  # MongoDB queries
│   │   ├── routes/
│   │   │   └── salesRoutes.js       # API routes
│   │   └── index.js                 # Express server
│   ├── scripts/
│   │   └── importData.js            # CSV import script
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── StatisticsCards.jsx
│   │   │   ├── SortingDropdown.jsx
│   │   │   ├── SalesTable.jsx
│   │   │   └── Pagination.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── hooks/
│   │   │   ├── useSalesData.js
│   │   │   └── useFilterOptions.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── [component].css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
├── Data/
│   └── truestate_assignment_dataset.csv  # 1M records (100k imported)
│
├── render.yaml                # Render deployment blueprint
├── RENDER_DEPLOY.md          # Deployment guide
├── DEPLOY_CHECKLIST.md       # Quick checklist
├── README.md
└── package.json              # Monorepo with workspaces
```

## API Endpoints

### GET /api/sales
Fetch sales data with query parameters

**Query Parameters:**
- `search` - Search term (customer name/phone)
- `customerRegion` - Comma-separated regions
- `gender` - Comma-separated genders
- `ageMin`, `ageMax` - Age range
- `productCategory` - Comma-separated categories
- `tags` - Comma-separated tags
- `paymentMethod` - Comma-separated payment methods
- `dateFrom`, `dateTo` - Date range (YYYY-MM-DD)
- `sortBy` - Sort field (date|quantity|customerName)
- `sortOrder` - Sort direction (asc|desc)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "totalRecords": 1000000,
    "totalPages": 100000,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

### GET /api/sales/statistics
Get aggregated statistics for filtered data

**Query Parameters:** (Same as /api/sales for filtering)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUnitsSold": 300917,
    "totalAmount": 760417079,
    "totalDiscount": 190313569
  }
}
```

### GET /api/sales/filters
Get available filter options

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": ["North", "South", "East", "West", "Central"],
    "genders": ["Male", "Female"],
    "categories": ["Clothing", "Electronics", "Beauty"],
    "tags": ["casual", "fashion", "wireless", ...],
    "paymentMethods": ["UPI", "Credit Card", "Debit Card", "Cash"]
  }
}
```

## Features

### Core Functionality
- ✅ Full-text search across customer name and phone number
- ✅ Multi-select filtering (Region, Gender, Category, Tags, Payment Method)
- ✅ Range filtering (Age, Date)
- ✅ Sorting by Date, Quantity, Customer Name
- ✅ Pagination with smart page controls
- ✅ Real-time statistics (Total Units, Amount, Discount)
- ✅ Product ID and Employee Name tracking

### UI/UX Features
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Sidebar navigation with icons
- ✅ Loading states for async operations
- ✅ Empty state handling
- ✅ Error message display
- ✅ Debounced search input (500ms)
- ✅ Collapsible filter sections
- ✅ Single dropdown behavior (mutual exclusivity)
- ✅ Active filter indicators
- ✅ Quick reset functionality
- ✅ Styled filter buttons (28px height, #F3F3F3 background)

### Technical Features
- ✅ MongoDB Atlas integration with connection pooling
- ✅ Clean separation of concerns (MVC pattern)
- ✅ Modular component architecture
- ✅ Custom React hooks for state management
- ✅ RESTful API design
- ✅ Efficient MongoDB aggregation pipelines
- ✅ CORS enabled with production/development modes
- ✅ Environment-based configuration
- ✅ CSV import script with data transformation
- ✅ npm workspaces monorepo setup

## Performance

- **Dataset**: 100,000 records (MongoDB Atlas)
- **Database Connection**: Connection pooling with auto-reconnect
- **Query Response**: <200ms (indexed MongoDB queries)
- **Search Debounce**: 500ms
- **Memory Usage**: Optimized with MongoDB cursors
- **Storage**: 139.5 MB (MongoDB Atlas free tier)

