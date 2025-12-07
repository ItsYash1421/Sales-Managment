import React from 'react';
import '../styles/StatisticsCards.css';

const StatisticsCards = ({ statistics }) => {
  const { totalUnitsSold, totalAmount, totalDiscount, totalTransactions } = statistics;

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    const crores = Math.floor(amount / 10000000);
    const lakhs = Math.floor((amount % 10000000) / 100000);
    
    if (crores > 0) {
      return `₹${crores},${lakhs.toString().padStart(2, '0')},000`;
    } else if (lakhs > 0) {
      return `₹${lakhs},000`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatSR = (amount) => {
    const srs = Math.floor(amount / 100000);
    return `(${srs} SRs)`;
  };

  return (
    <div className="statistics-cards">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total units sold</span>
          <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
            <circle cx="12" cy="8.5" r="1" fill="currentColor"></circle>
          </svg>
        </div>
        <div className="stat-value">{totalUnitsSold || 0}</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Amount</span>
          <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
            <circle cx="12" cy="8.5" r="1" fill="currentColor"></circle>
          </svg>
        </div>
        <div className="stat-value-wrapper">
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <span className="stat-subtitle">{formatSR(totalAmount)}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Discount</span>
          <svg className="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
            <circle cx="12" cy="8.5" r="1" fill="currentColor"></circle>
          </svg>
        </div>
        <div className="stat-value-wrapper">
          <div className="stat-value">{formatCurrency(totalDiscount)}</div>
          <span className="stat-subtitle">{formatSR(totalDiscount)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;
