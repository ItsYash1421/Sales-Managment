import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filters, setFilters, filterOptions }) => {
  const [expandedSections, setExpandedSections] = useState({
    customerRegion: false,
    gender: false,
    ageRange: false,
    productCategory: false,
    tags: false,
    paymentMethod: false,
    dateRange: false
  });
  
  const [tempAgeMin, setTempAgeMin] = useState('');
  const [tempAgeMax, setTempAgeMax] = useState('');
  const [tempDateFrom, setTempDateFrom] = useState('');
  const [tempDateTo, setTempDateTo] = useState('');
  
  const panelRef = useRef(null);

  useEffect(() => {
    setTempAgeMin(filters.ageMin || '');
    setTempAgeMax(filters.ageMax || '');
    setTempDateFrom(filters.dateFrom || '');
    setTempDateTo(filters.dateTo || '');
  }, [filters.ageMin, filters.ageMax, filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    const closeAllDropdowns = () => {
      setExpandedSections({
        customerRegion: false,
        gender: false,
        ageRange: false,
        productCategory: false,
        tags: false,
        paymentMethod: false,
        dateRange: false
      });
    };

   
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    
    const handleScroll = (event) => {
      const target = event.target;
      
      if (target.classList && (target.classList.contains('filter-options') || target.classList.contains('filter-range'))) {
        return;
      }
     
      closeAllDropdowns();
    };

    window.addEventListener('closeAllDropdowns', closeAllDropdowns);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('closeAllDropdowns', closeAllDropdowns);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const toggleSection = (section, event) => {
    if (expandedSections[section]) {
     
      setExpandedSections({
        customerRegion: false,
        gender: false,
        ageRange: false,
        productCategory: false,
        tags: false,
        paymentMethod: false,
        dateRange: false
      });
    } else {
     
      window.dispatchEvent(new Event('closeAllDropdowns'));
      
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdown = event.currentTarget.nextElementSibling;
      if (dropdown) {
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.top = `${rect.bottom}px`;
      }
      setExpandedSections({
        customerRegion: false,
        gender: false,
        ageRange: false,
        productCategory: false,
        tags: false,
        paymentMethod: false,
        dateRange: false,
        [section]: true
      });
    }
  };

  const handleMultiSelectChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType]?.includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...(prev[filterType] || []), value]
    }));
  };

  const applyAgeFilter = () => {
    setFilters(prev => ({
      ...prev,
      ageMin: tempAgeMin,
      ageMax: tempAgeMax
    }));
    setExpandedSections(prev => ({ ...prev, ageRange: false }));
  };

  const applyDateFilter = () => {
    setFilters(prev => ({
      ...prev,
      dateFrom: tempDateFrom,
      dateTo: tempDateTo
    }));
    setExpandedSections(prev => ({ ...prev, dateRange: false }));
  };

  const clearFilters = () => {
    setFilters({
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
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.customerRegion?.length || 0;
    count += filters.gender?.length || 0;
    count += filters.productCategory?.length || 0;
    count += filters.tags?.length || 0;
    count += filters.paymentMethod?.length || 0;
    if (filters.ageMin || filters.ageMax) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  return (
    <div className="filter-panel" ref={panelRef}>
      <div className="filters-horizontal">
        {/* Reset Filter Button */}
        <button className="reset-filter-btn-main" onClick={clearFilters} title="Reset all filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
        </button>

        {/* Customer Region */}
        <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('customerRegion', e)}>
          <h4>Customer Region</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.customerRegion && (
          <div className="filter-options">
            {filterOptions.regions?.map(region => (
              <label key={region} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.customerRegion?.includes(region)}
                  onChange={() => handleMultiSelectChange('customerRegion', region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('gender', e)}>
          <h4>Gender</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.gender && (
          <div className="filter-options">
            {filterOptions.genders?.map(gender => (
              <label key={gender} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.gender?.includes(gender)}
                  onChange={() => handleMultiSelectChange('gender', gender)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Age Range */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('ageRange', e)}>
          <h4>Age Range</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.ageRange && (
          <div className="filter-range">
            <div className="range-input-group">
              <label>Min Age</label>
              <input
                type="number"
                placeholder="0"
                value={tempAgeMin}
                onChange={(e) => setTempAgeMin(e.target.value)}
                min="0"
                max="120"
              />
            </div>
            <div className="range-input-group">
              <label>Max Age</label>
              <input
                type="number"
                placeholder="120"
                value={tempAgeMax}
                onChange={(e) => setTempAgeMax(e.target.value)}
                min="0"
                max="120"
              />
            </div>
            <button className="apply-filter-btn" onClick={applyAgeFilter}>
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Product Category */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('productCategory', e)}>
          <h4>Product Category</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.productCategory && (
          <div className="filter-options">
            {filterOptions.categories?.map(category => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.productCategory?.includes(category)}
                  onChange={() => handleMultiSelectChange('productCategory', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('tags', e)}>
          <h4>Tags</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.tags && (
          <div className="filter-options scrollable">
            {filterOptions.tags?.map(tag => (
              <label key={tag} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag)}
                  onChange={() => handleMultiSelectChange('tags', tag)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('paymentMethod', e)}>
          <h4>Payment Method</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.paymentMethod && (
          <div className="filter-options">
            {filterOptions.paymentMethods?.map(method => (
              <label key={method} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.paymentMethod?.includes(method)}
                  onChange={() => handleMultiSelectChange('paymentMethod', method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={(e) => toggleSection('dateRange', e)}>
          <h4>Date</h4>
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {expandedSections.dateRange && (
          <div className="filter-range">
            <div className="range-input-group">
              <label>From Date</label>
              <input
                type="date"
                value={tempDateFrom}
                onChange={(e) => setTempDateFrom(e.target.value)}
              />
            </div>
            <div className="range-input-group">
              <label>To Date</label>
              <input
                type="date"
                value={tempDateTo}
                onChange={(e) => setTempDateTo(e.target.value)}
              />
            </div>
            <button className="apply-filter-btn" onClick={applyDateFilter}>
              Apply
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default FilterPanel;
