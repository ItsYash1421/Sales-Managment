import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Fetch sales data with filters, search, sorting, and pagination
 */
export const fetchSalesData = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.customerRegion?.length) queryParams.append('customerRegion', params.customerRegion.join(','));
    if (params.gender?.length) queryParams.append('gender', params.gender.join(','));
    if (params.ageMin) queryParams.append('ageMin', params.ageMin);
    if (params.ageMax) queryParams.append('ageMax', params.ageMax);
    if (params.productCategory?.length) queryParams.append('productCategory', params.productCategory.join(','));
    if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
    if (params.paymentMethod?.length) queryParams.append('paymentMethod', params.paymentMethod.join(','));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    
    const response = await api.get(`/sales?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

/**
 * Fetch statistics
 */
export const fetchStatistics = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.customerRegion?.length) queryParams.append('customerRegion', params.customerRegion.join(','));
    if (params.gender?.length) queryParams.append('gender', params.gender.join(','));
    if (params.ageMin) queryParams.append('ageMin', params.ageMin);
    if (params.ageMax) queryParams.append('ageMax', params.ageMax);
    if (params.productCategory?.length) queryParams.append('productCategory', params.productCategory.join(','));
    if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
    if (params.paymentMethod?.length) queryParams.append('paymentMethod', params.paymentMethod.join(','));
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const response = await api.get(`/sales/statistics?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

/**
 * Fetch filter options
 */
export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

export default api;
