# System Architecture

## Overview
The Retail Sales Management System is a full-stack web application built with a clean separation between frontend and backend. It processes and displays 1 million sales transaction records with advanced search, filtering, sorting, and pagination capabilities.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  UI Components Layer                                     │ │
│  │  - Header, SearchBar, FilterPanel                        │ │
│  │  - StatisticsCards, SalesTable, Pagination              │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  State Management Layer (Custom Hooks)                   │ │
│  │  - useSalesData: Manages data, filters, pagination      │ │
│  │  - useFilterOptions: Manages available filter values    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Service Layer (API Integration)                         │ │
│  │  - fetchSalesData, fetchStatistics, fetchFilterOptions  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Routes Layer                                            │ │
│  │  - GET /api/sales (query endpoint)                       │ │
│  │  - GET /api/sales/statistics                            │ │
│  │  - GET /api/sales/filters                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Controllers Layer                                       │ │
│  │  - getSales: Handle query requests                       │ │
│  │  - getStats: Calculate aggregated statistics            │ │
│  │  - getFilters: Return available filter options          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Services Layer                                          │ │
│  │  - dataService: Load and store CSV data                 │ │
│  │  - queryService: Search, filter, sort, paginate logic   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Data Layer (In-Memory Storage)                          │ │
│  │  - Parsed CSV data stored as JavaScript array           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                     CSV Dataset (1M records)
```

## Backend Architecture

### Data Flow
1. **Initialization**: CSV file loaded into memory on server startup
2. **Request Processing**: Client sends query parameters via HTTP GET
3. **Query Execution**: Sequential application of search → filter → sort → paginate
4. **Response**: JSON payload with data array and pagination metadata

### Module Responsibilities

#### `/src/index.js`
- Express server initialization
- Middleware configuration (CORS, JSON parsing)
- Route registration
- Dataset loading orchestration

#### `/src/routes/salesRoutes.js`
- Define API endpoints
- Map routes to controller functions
- Export router for main app

#### `/src/controllers/salesController.js`
- Request validation and parameter parsing
- Business logic coordination
- Response formatting
- Error handling

#### `/src/services/dataService.js`
**Responsibilities:**
- Load CSV file using `csv-parser`
- Parse and normalize data fields
- Store in-memory dataset
- Provide data access methods
- Extract unique filter options

**Key Functions:**
- `loadDataset()`: Load CSV into memory
- `getAllSalesData()`: Return full dataset
- `getFilterOptions()`: Extract unique values for filters

#### `/src/services/queryService.js`
**Responsibilities:**
- Implement search logic (case-insensitive substring matching)
- Apply multi-select and range filters
- Execute sorting algorithms
- Paginate results
- Calculate statistics

**Key Functions:**
- `applySearch()`: Filter by customer name/phone
- `applyFilters()`: Multi-level filtering
- `applySorting()`: Sort by date/quantity/name
- `applyPagination()`: Slice results for current page
- `querySalesData()`: Orchestrate full query pipeline
- `getStatistics()`: Aggregate totals

### Performance Considerations
- **In-Memory Storage**: 1M records (~200MB RAM) for O(1) access
- **Sequential Processing**: Search → Filter → Sort → Paginate
- **No Database Overhead**: Eliminates query compilation and I/O latency
- **Trade-offs**: Memory usage vs speed (optimized for read-heavy workloads)

## Frontend Architecture

### Component Hierarchy
```
App
└── Dashboard
    ├── Header
    ├── FilterPanel
    ├── SearchBar
    ├── SortingDropdown
    ├── StatisticsCards
    ├── SalesTable
    └── Pagination
```

### State Management Pattern
- **Custom Hooks** for business logic encapsulation
- **Prop Drilling** for component communication (lightweight, no Redux needed)
- **URL Synchronization** possible via query params (not implemented but architected for)

### Module Responsibilities

#### `/src/pages/Dashboard.jsx`
- Main layout orchestration
- State coordination between components
- Event handler delegation

#### `/src/components/`
- **Header**: Branding, navigation, user avatar
- **SearchBar**: Debounced input with clear button
- **FilterPanel**: Collapsible multi-select filters
- **StatisticsCards**: Display aggregated metrics
- **SortingDropdown**: Sort option selector
- **SalesTable**: Transaction data table with responsive design
- **Pagination**: Page navigation controls

#### `/src/hooks/useSalesData.js`
**Responsibilities:**
- Centralize all data fetching
- Manage filter state
- Coordinate search, filter, sort, pagination
- Handle loading and error states

**State:**
- `salesData`: Current page records
- `statistics`: Aggregated totals
- `pagination`: Page metadata
- `filters`: Active search/filter/sort parameters

#### `/src/hooks/useFilterOptions.js`
- Fetch available filter values
- Cache options to prevent redundant API calls

#### `/src/services/api.js`
- Axios instance configuration
- API endpoint functions
- Query parameter serialization
- Error handling

#### `/src/utils/helpers.js`
- Currency formatting (INR)
- Date formatting
- Phone number formatting
- Debounce utility

### Styling Approach
- **Plain CSS** with CSS custom properties (variables)
- **Component-scoped** stylesheets
- **Responsive design** with media queries
- **Design system** via CSS variables for consistency

## Data Flow Example

### User Searches for "Neha" and Filters by "Female" + "South Region"

1. **Frontend:**
   - User types "Neha" → debounced (500ms)
   - User selects "Female" and "South"
   - `useSalesData` hook updates filter state
   - `useEffect` triggers `loadData()`

2. **API Request:**
   ```
   GET /api/sales?search=Neha&gender=Female&customerRegion=South&sortBy=date&sortOrder=desc&page=1&pageSize=10
   ```

3. **Backend Processing:**
   - `salesController.getSales()` parses query params
   - `queryService.querySalesData()` executes:
     - Search: Filter customerName/phoneNumber containing "neha"
     - Filter: Keep only gender=Female AND region=South
     - Sort: Order by date descending
     - Paginate: Return records 1-10
   - `queryService.getStatistics()` calculates totals on filtered data

4. **Response:**
   ```json
   {
     "success": true,
     "data": [...10 records],
     "pagination": {
       "totalRecords": 347,
       "totalPages": 35,
       "currentPage": 1,
       "pageSize": 10
     }
   }
   ```

5. **Frontend Update:**
   - `useSalesData` updates state
   - Components re-render with new data
   - Statistics cards show filtered totals
   - Table displays 10 records
   - Pagination shows 35 pages

## Folder Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   └── salesController.js       # Request handlers
│   ├── services/
│   │   ├── dataService.js           # CSV loading & storage
│   │   └── queryService.js          # Business logic
│   ├── routes/
│   │   └── salesRoutes.js           # Route definitions
│   └── index.js                     # Entry point
├── .env                             # Environment variables
├── package.json
└── README.md
```

### Frontend
```
frontend/
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── StatisticsCards.jsx
│   │   ├── SortingDropdown.jsx
│   │   ├── SalesTable.jsx
│   │   └── Pagination.jsx
│   ├── pages/                       # Page-level components
│   │   └── Dashboard.jsx
│   ├── services/                    # API integration
│   │   └── api.js
│   ├── hooks/                       # Custom React hooks
│   │   ├── useSalesData.js
│   │   └── useFilterOptions.js
│   ├── utils/                       # Helper functions
│   │   └── helpers.js
│   ├── styles/                      # CSS files
│   │   ├── index.css
│   │   ├── App.css
│   │   └── [Component].css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Design Decisions

### Why In-Memory Storage?
- **Speed**: No database I/O latency
- **Simplicity**: No ORM or query builder needed
- **Appropriate Scale**: 1M records fits comfortably in modern server RAM
- **Stateless**: Easy horizontal scaling (dataset loaded per instance)

### Why No Database?
- Dataset is static (read-only)
- No concurrent writes
- Application scope is data exploration, not CRUD operations
- Reduces infrastructure complexity

### Why Custom Hooks vs Redux?
- State is localized to Dashboard
- No deep component nesting requiring global state
- Fewer dependencies and boilerplate
- Easier to understand and maintain

### Why Sequential Filtering?
- Clear, predictable logic flow
- Easy to debug and test
- Performance acceptable for dataset size
- Alternative (indexed structures) adds complexity without significant benefit at this scale

## Scalability Considerations

### Current Limitations
- Single-threaded Node.js for query processing
- Full dataset loaded per server instance
- No caching layer

### Potential Improvements
1. **Database Migration**: PostgreSQL with indexes for >10M records
2. **Caching**: Redis for frequent queries
3. **Pagination Optimization**: Cursor-based instead of offset-based
4. **Backend Pagination**: Server-side virtual scrolling
5. **Search Enhancement**: Full-text search engine (Elasticsearch)
6. **Load Balancing**: Multiple backend instances with shared cache

## Security Considerations

### Implemented
- CORS configuration
- Input sanitization (query param parsing)
- Error message sanitization (no stack traces to client)

### Production Requirements
- Rate limiting (prevent DoS)
- Authentication & authorization
- HTTPS/TLS
- Input validation with schemas
- SQL injection prevention (if database added)
- XSS protection
- CSRF tokens

## Testing Strategy

### Unit Tests (Recommended)
- **Backend**: Test each service function independently
- **Frontend**: Test hooks and utility functions

### Integration Tests
- **Backend**: Test full API endpoints
- **Frontend**: Test component interactions

### E2E Tests
- **Playwright/Cypress**: Test complete user workflows

## Deployment Architecture

### Development
```
Frontend: Vite Dev Server (localhost:3000)
Backend: Node.js (localhost:8001)
```

### Production (Recommended)
```
Frontend: Static build → CDN (Vercel, Netlify, AWS S3 + CloudFront)
Backend: Node.js → Container (Docker) → Cloud Platform (AWS EC2, GCP Cloud Run, Heroku)
```

### Environment Variables
**Backend:**
- `PORT`: Server port
- `CSV_FILE_PATH`: Dataset location

**Frontend:**
- `VITE_API_URL`: Backend API base URL


## Code Quality Standards

### Backend
- ES6+ modules
- Async/await for asynchronous operations
- Clear function naming
- Single Responsibility Principle
- Error handling at all levels

### Frontend
- Functional components with hooks
- PropTypes for type checking (or TypeScript migration)
- Component composition over inheritance
- Separation of concerns (presentation vs logic)
- Consistent naming conventions
