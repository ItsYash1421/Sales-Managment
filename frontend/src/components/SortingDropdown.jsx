import React, { useState, useRef, useEffect } from 'react';
import '../styles/SortingDropdown.css';

const SortingDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'customerName', label: 'Customer Name (A-Z)' }
  ];

  const currentOption = sortOptions.find(opt => opt.value === sortBy);

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

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const handleToggle = (event) => {
    if (!isOpen) {
      // Close all other dropdowns
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
              className={`sorting-option ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="option-label">{option.label}</span>
              {sortBy === option.value && (
                <span className="option-order">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortingDropdown;
