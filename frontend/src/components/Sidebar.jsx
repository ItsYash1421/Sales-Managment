import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    services: false,
    invoices: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">V</div>
          <div className="logo-text">
            <div className="logo-title">Vault</div>
            <div className="logo-subtitle">Anurag Yadav</div>
          </div>
          <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <img src="/icons/dashboard.png" alt="Dashboard" className="nav-icon" />
          <span className="nav-label">Dashboard</span>
        </div>

        <div
          className={`nav-item ${activeSection === 'nexus' ? 'active' : ''}`}
          onClick={() => setActiveSection('nexus')}
        >
          <img src="/icons/nexus.png" alt="Nexus" className="nav-icon" />
          <span className="nav-label">Nexus</span>
        </div>

        <div
          className={`nav-item ${activeSection === 'intake' ? 'active' : ''}`}
          onClick={() => setActiveSection('intake')}
        >
          <img src="/icons/nexus.png" alt="Intake" className="nav-icon" />
          <span className="nav-label">Intake</span>
        </div>

        <div className="nav-section">
          <div
            className={`nav-item expandable ${expandedSections.services ? 'expanded' : ''}`}
            onClick={() => toggleSection('services')}
          >
            <img src="/icons/services.png" alt="Services" className="nav-icon" />
            <span className="nav-label">Services</span>
            <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {expandedSections.services && (
            <div className="nav-submenu">
              <div className="nav-subitem">
                <img src="/icons/preactive.png" alt="Pre-active" className="nav-subicon" />
                <span className="nav-sublabel">Pre-active</span>
              </div>
              <div className="nav-subitem">
                <img src="/icons/active.png" alt="Active" className="nav-subicon" />
                <span className="nav-sublabel">Active</span>
              </div>
              <div className="nav-subitem">
                <img src="/icons/blocked.png" alt="Blocked" className="nav-subicon" />
                <span className="nav-sublabel">Blocked</span>
              </div>
              <div className="nav-subitem">
                <img src="/icons/closed.png" alt="Closed" className="nav-subicon" />
                <span className="nav-sublabel">Closed</span>
              </div>
            </div>
          )}
        </div>

        <div className="nav-section">
          <div
            className={`nav-item expandable ${expandedSections.invoices ? 'expanded' : ''}`}
            onClick={() => toggleSection('invoices')}
          >
            <img src="/icons/invoices.png" alt="Invoices" className="nav-icon" />
            <span className="nav-label">Invoices</span>
            <svg className="nav-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {expandedSections.invoices && (
            <div className="nav-submenu">
              <div className="nav-subitem">
                <img src="/icons/proforma.png" alt="Proforma" className="nav-subicon" />
                <span className="nav-sublabel">Proforma Invoices</span>
              </div>
              <div className="nav-subitem">
                <img src="/icons/proforma.png" alt="Final" className="nav-subicon" />
                <span className="nav-sublabel">Final Invoices</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
