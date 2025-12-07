import { useState, useEffect, useCallback } from 'react';
import { fetchSalesData, fetchStatistics } from '../services/api';

export const useSalesData = () => {
  const [salesData, setSalesData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [salesResponse, statsResponse] = await Promise.all([
        fetchSalesData(filters),
        fetchStatistics(filters)
      ]);
      
      setSalesData(salesResponse.data);
      setPagination(salesResponse.pagination);
      setStatistics(statsResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    });
  };

  return {
    salesData,
    statistics,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    reload: loadData
  };
};
