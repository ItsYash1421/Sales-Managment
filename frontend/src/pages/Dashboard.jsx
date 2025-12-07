import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import StatisticsCards from '../components/StatisticsCards';
import SortingDropdown from '../components/SortingDropdown';
import SalesTable from '../components/SalesTable';
import { fetchSalesData, fetchStatistics, fetchFilterOptions } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [statistics, setStatistics] = useState({
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: []
  });
  const [filters, setFilters] = useState({
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: '',
    dateTo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchTerm,
          customerRegion: filters.customerRegion,
          gender: filters.gender,
          ageMin: filters.ageMin,
          ageMax: filters.ageMax,
          productCategory: filters.productCategory,
          tags: filters.tags,
          paymentMethod: filters.paymentMethod,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          sortBy,
          sortOrder,
          page: currentPage,
          pageSize
        };

        const [salesResponse, statsResponse] = await Promise.all([
          fetchSalesData(params),
          fetchStatistics(params)
        ]);

        setSalesData(salesResponse.data);
        setTotalPages(salesResponse.totalPages);
        setTotalRecords(salesResponse.totalRecords);
        setStatistics(statsResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, searchTerm, sortBy, sortOrder, currentPage]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Sales Management System</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="filters-row">
            <FilterPanel 
              filters={filters}
              setFilters={handleFiltersChange}
              filterOptions={filterOptions}
            />
            <SortingDropdown 
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          <StatisticsCards statistics={statistics} />

          <div className="content-area">
            <SalesTable 
              data={salesData} 
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
