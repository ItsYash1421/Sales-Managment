import { getSalesData, getStatistics, getFilterOptions } from '../services/mongoDataService.js';

/**
 * Get sales data with search, filters, sorting, and pagination
 */
export const getSales = async (req, res) => {
  try {
    const queryParams = {
      search: req.query.search,
      customerRegion: req.query.customerRegion ? req.query.customerRegion.split(',') : undefined,
      gender: req.query.gender ? req.query.gender.split(',') : undefined,
      ageMin: req.query.ageMin,
      ageMax: req.query.ageMax,
      productCategory: req.query.productCategory ? req.query.productCategory.split(',') : undefined,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      paymentMethod: req.query.paymentMethod ? req.query.paymentMethod.split(',') : undefined,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || 'desc',
      page: req.query.page,
      pageSize: req.query.pageSize
    };
    
    const result = await getSalesData(queryParams);
    
    res.json({
      data: result.data,
      totalRecords: result.totalRecords,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      pageSize: result.pageSize
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data',
      error: error.message
    });
  }
};

/**
 * Get statistics
 */
export const getStats = async (req, res) => {
  try {
    const queryParams = {
      search: req.query.search,
      customerRegion: req.query.customerRegion ? req.query.customerRegion.split(',') : undefined,
      gender: req.query.gender ? req.query.gender.split(',') : undefined,
      ageMin: req.query.ageMin,
      ageMax: req.query.ageMax,
      productCategory: req.query.productCategory ? req.query.productCategory.split(',') : undefined,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      paymentMethod: req.query.paymentMethod ? req.query.paymentMethod.split(',') : undefined,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo
    };
    
    const stats = await getStatistics(queryParams);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

/**
 * Get filter options
 */
export const getFilters = async (req, res) => {
  try {
    const options = await getFilterOptions();
    
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
};
