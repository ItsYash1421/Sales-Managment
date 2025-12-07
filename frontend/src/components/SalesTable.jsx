import React from 'react';
import Pagination from './Pagination';
import '../styles/SalesTable.css';

const SalesTable = ({ data, loading, currentPage, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>No records found</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer region</th>
              <th>Product ID</th>
              <th>Employee name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={`${row.transactionId}-${index}`}>
                <td>{row.transactionId || '-'}</td>
                <td>{row.date || '-'}</td>
                <td>{row.customerId || '-'}</td>
                <td>{row.customerName || '-'}</td>
                <td>
                  {row.phoneNumber ? (
                    <div className="phone-cell">
                      <span>{row.phoneNumber}</span>
                      <button className="copy-btn" onClick={() => navigator.clipboard.writeText(row.phoneNumber)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  ) : '-'}
                </td>
                <td>{row.gender || '-'}</td>
                <td>{row.age || '-'}</td>
                <td>{row.productCategory || '-'}</td>
                <td>{row.quantity?.toString().padStart(2, '0') || '-'}</td>
                <td>
                  {row.totalAmount ? (
                    <span className="amount">₹ {row.totalAmount.toLocaleString('en-IN')}</span>
                  ) : '-'}
                </td>
                <td>{row.customerRegion || '-'}</td>
                <td>{row.productId || '-'}</td>
                <td>{row.employeeName || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SalesTable;
