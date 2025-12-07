import React, { useState, useRef, useEffect } from 'react';
import '../styles/SortingDropdown.css';

const SortingDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'date-desc', sortBy: 'date', sortOrder: 'desc', label: 'Date: New to Old' },
    { value: 'date-asc', sortBy: 'date', sortOrder: 'asc', label: 'Date: Old to New' },
    { value: 'quantity-desc', sortBy: 'quantity', sortOrder: 'desc', label: 'Quantity: High to Low' },
    { value: 'quantity-asc', sortBy: 'quantity', sortOrder: 'asc', label: 'Quantity: Low to High' },
    { value: 'customerName-asc', sortBy: 'customerName', sortOrder: 'asc', label: 'Customer Name: A-Z' },
    { value: 'customerName-desc', sortBy: 'customerName', sortOrder: 'desc', label: 'Customer Name: Z-A' }
  ];

  const currentOption = sortOptions.find(opt => opt.sortBy === sortBy && opt.sortOrder === sortOrder);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    const handleCloseAllDropdowns = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('closeAllDropdowns', handleCloseAllDropdowns);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('closeAllDropdowns', handleCloseAllDropdowns);
    };
  }, []);

  const handleSelect = (option) => {
    onSortChange(option.sortBy, option.sortOrder);
    setIsOpen(false);
  };

  const handleToggle = (event) => {
    if (!isOpen) {
     
      window.dispatchEvent(new Event('closeAllDropdowns'));
      
      const rect = event.currentTarget.getBoundingClientRect();
      setTimeout(() => {
        const menu = dropdownRef.current?.querySelector('.sorting-menu');
        if (menu) {
          const menuWidth = 260;
          menu.style.left = `${rect.right - menuWidth}px`;
          menu.style.top = `${rect.bottom + 4}px`;
        }
      }, 0);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="sorting-dropdown" ref={dropdownRef}>
      <button 
        className="sorting-trigger"
        onClick={handleToggle}
      >
        <span className="sorting-label">Sort by:</span>
        <span className="sorting-value">{currentOption?.label || 'Select'}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`} 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="sorting-menu">
          {sortOptions.map(option => (
            <div
              key={option.value}
              className={`sorting-option ${sortBy === option.sortBy && sortOrder === option.sortOrder ? 'active' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <span className="option-label">{option.label}</span>
              {sortBy === option.sortBy && sortOrder === option.sortOrder && (
                <span className="option-checkmark">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortingDropdown;
