import { getDB } from '../config/database.js';

/**
 * Get all sales data with filters and pagination
 */
export const getSalesData = async (filters = {}) => {
  try {
    const db = getDB();
    const collection = db.collection('sales');
    const query = {};
    if (filters.search) {
      query.$or = [
        { customerName: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      query.customerRegion = { $in: filters.customerRegion };
    }
    
    if (filters.gender && filters.gender.length > 0) {
      query.gender = { $in: filters.gender };
    }
    
    if (filters.ageMin || filters.ageMax) {
      query.age = {};
      if (filters.ageMin) query.age.$gte = parseInt(filters.ageMin);
      if (filters.ageMax) query.age.$lte = parseInt(filters.ageMax);
    }
    
    if (filters.productCategory && filters.productCategory.length > 0) {
      query.productCategory = { $in: filters.productCategory };
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      query.paymentMethod = { $in: filters.paymentMethod };
    }
    
    if (filters.dateFrom || filters.dateTo) {
      query.date = {};
      if (filters.dateFrom) query.date.$gte = filters.dateFrom;
      if (filters.dateTo) query.date.$lte = filters.dateTo;
    }
    const totalRecords = await collection.countDocuments(query);

    const sortOptions = {};
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      sortOptions[filters.sortBy] = sortOrder;
    } else {
      sortOptions.date = -1; 
    }
    const page = parseInt(filters.page) || 1;
    const pageSize = parseInt(filters.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const data = await collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    
    return {
      data,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

/**
 * Get statistics
 */
export const getStatistics = async (filters = {}) => {
  try {
    const db = getDB();
    const collection = db.collection('sales');
    const query = {};
    if (filters.search) {
      query.$or = [
        { customerName: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      query.customerRegion = { $in: filters.customerRegion };
    }
    
    if (filters.gender && filters.gender.length > 0) {
      query.gender = { $in: filters.gender };
    }
    
    if (filters.ageMin || filters.ageMax) {
      query.age = {};
      if (filters.ageMin) query.age.$gte = parseInt(filters.ageMin);
      if (filters.ageMax) query.age.$lte = parseInt(filters.ageMax);
    }
    
    if (filters.productCategory && filters.productCategory.length > 0) {
      query.productCategory = { $in: filters.productCategory };
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      query.paymentMethod = { $in: filters.paymentMethod };
    }
    
    if (filters.dateFrom || filters.dateTo) {
      query.date = {};
      if (filters.dateFrom) query.date.$gte = filters.dateFrom;
      if (filters.dateTo) query.date.$lte = filters.dateTo;
    }
    
    const result = await collection.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUnitsSold: { $sum: '$quantity' },
          totalAmount: { $sum: '$totalAmount' },
          totalDiscount: { $sum: '$discountAmount' }
        }
      }
    ]).toArray();
    
    if (result.length > 0) {
      return {
        totalUnitsSold: result[0].totalUnitsSold || 0,
        totalAmount: Math.round(result[0].totalAmount || 0),
        totalDiscount: Math.round(result[0].totalDiscount || 0)
      };
    }
    
    return {
      totalUnitsSold: 0,
      totalAmount: 0,
      totalDiscount: 0
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

/**
 * Get unique filter options
 */
export const getFilterOptions = async () => {
  try {
    const db = getDB();
    const collection = db.collection('sales');
    
    const [regions, genders, categories, paymentMethods, tags] = await Promise.all([
      collection.distinct('customerRegion'),
      collection.distinct('gender'),
      collection.distinct('productCategory'),
      collection.distinct('paymentMethod'),
      collection.distinct('tags')
    ]);
    
    return {
      regions: regions.filter(Boolean).sort(),
      genders: genders.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
      paymentMethods: paymentMethods.filter(Boolean).sort()
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};
