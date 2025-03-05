// src/components/steps/ConfigureFilters.js
import React from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

// Enhanced ZenHR API filter descriptions based on the documentation
const enhancedFilterDescriptions = {
  employees: {
    created_from: {
      description: "Filter employees created on or after this date",
      example: "2023-01-01"
    },
    created_to: {
      description: "Filter employees created on or before this date",
      example: "2023-12-31"
    },
    hire_date_from: {
      description: "Filter employees hired on or after this date",
      example: "2023-01-01"
    },
    hire_date_to: {
      description: "Filter employees hired on or before this date",
      example: "2023-12-31"
    },
    department_id: {
      description: "Filter employees by department ID",
      example: "12345"
    },
    branch_id: {
      description: "Filter employees by branch office ID",
      example: "5678"
    },
    status: {
      description: "Filter employees by employment status",
      example: "active",
      options: ["active", "inactive", "on_leave", "terminated"]
    }
  },
  attendance: {
    employee_id: {
      description: "Filter attendance by employee ID",
      example: "12345"
    },
    date_from: {
      description: "Filter attendance from this date",
      example: "2023-01-01"
    },
    date_to: {
      description: "Filter attendance until this date",
      example: "2023-01-31"
    },
    status: {
      description: "Filter by attendance status",
      example: "present",
      options: ["present", "absent", "late", "early_departure"]
    }
  },
  payroll: {
    employee_id: {
      description: "Filter payroll by employee ID",
      example: "12345"
    },
    period_start: {
      description: "Filter payroll by period start date",
      example: "2023-01-01"
    },
    period_end: {
      description: "Filter payroll by period end date",
      example: "2023-01-31"
    },
    payment_date_from: {
      description: "Filter payroll by payment date (from)",
      example: "2023-02-01"
    },
    payment_date_to: {
      description: "Filter payroll by payment date (to)",
      example: "2023-02-05"
    }
  },
  leaves: {
    employee_id: {
      description: "Filter leaves by employee ID",
      example: "12345"
    },
    start_date_from: {
      description: "Filter leaves starting on or after this date",
      example: "2023-01-01"
    },
    start_date_to: {
      description: "Filter leaves starting on or before this date",
      example: "2023-12-31"
    },
    status: {
      description: "Filter by leave request status",
      example: "approved",
      options: ["pending", "approved", "rejected", "cancelled"]
    },
    type_id: {
      description: "Filter by leave type ID",
      example: "2"
    }
  },
  documents: {
    employee_id: {
      description: "Filter documents by employee ID",
      example: "12345"
    },
    created_from: {
      description: "Filter documents created on or after this date",
      example: "2023-01-01"
    },
    created_to: {
      description: "Filter documents created on or before this date",
      example: "2023-12-31"
    },
    type: {
      description: "Filter by document type",
      example: "contract",
      options: ["contract", "id", "resume", "certificate", "other"]
    }
  }
};

const ConfigureFilters = () => {
  const {
    selectedEndpoint,
    selectedMethod,
    filterValues,
    handleFilterValueChange,
    pagination,
    handlePaginationChange,
    getEndpointFilters
  } = useIntegration();

  // Get available filters for the selected endpoint
  const availableFilters = getEndpointFilters(selectedEndpoint);

  // Only show filters for GET requests
  const showFilters = selectedMethod === 'GET';

  // Get enhanced filter descriptions for the current endpoint
  const currentEndpointFilters = enhancedFilterDescriptions[selectedEndpoint] || {};

  // Get formatted endpoint name
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderFilterInput = (filter) => {
    const value = filterValues[filter.id] || '';
    const enhancedFilter = currentEndpointFilters[filter.id] || {};
    
    switch (filter.type) {
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            className="input"
            placeholder={enhancedFilter.example || ''}
          />
        );
      case 'select':
      case 'enum':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            className="select"
          >
            <option value="">Select an option</option>
            {enhancedFilter.options && enhancedFilter.options.map(option => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            className="select"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            className="input"
            placeholder={enhancedFilter.example || ''}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
            placeholder={enhancedFilter.example || `Enter ${filter.name.toLowerCase()}`}
            className="input"
          />
        );
    }
  };

  const renderPaginationInfo = () => {
    // Calculate potential number of records
    const pageSize = pagination.per_page;
    const currentPage = pagination.page;
    
    return (
      <div className="text-sm text-gray-600 mt-2">
        <p>Records {(currentPage - 1) * pageSize + 1} to {currentPage * pageSize}</p>
        <p className="mt-1">
          <strong>Note:</strong> The actual number of records returned depends on the total available and your filter settings.
        </p>
      </div>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    availableFilters.forEach(filter => {
      handleFilterValueChange(filter.id, '');
    });
  };

  // Check if any filters are applied
  const hasActiveFilters = Object.values(filterValues).some(value => value);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">
          {showFilters ? 'Configure Filters & Pagination' : 'Configure Request'}
        </h2>
        <p className="text-gray-600">
          {showFilters
            ? `Specify filters to narrow down the data returned from the ${getFormattedEndpointName()} endpoint.`
            : 'No additional filters needed for this request method.'}
        </p>
      </div>

      {showFilters && (
        <>
          {/* Filters */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-zenhr-blue">Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-sm btn-outline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            {availableFilters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFilters.map(filter => {
                  const enhancedFilter = currentEndpointFilters[filter.id] || {};
                  const isFilterActive = !!filterValues[filter.id];
                  
                  return (
                    <div key={filter.id} className={`p-4 border rounded-md ${isFilterActive ? 'border-zenhr-blue bg-zenhr-blue-lighter' : 'border-gray-200'}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {filter.name}
                      </label>
                      {renderFilterInput(filter)}
                      <div className="flex items-center mt-1">
                        <svg className="text-gray-400 mr-1" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5.25C8.41421 5.25 8.75 4.91421 8.75 4.5C8.75 4.08579 8.41421 3.75 8 3.75C7.58579 3.75 7.25 4.08579 7.25 4.5C7.25 4.91421 7.58579 5.25 8 5.25Z" fill="currentColor"/>
                          <path d="M8 12.25C8.41421 12.25 8.75 11.9142 8.75 11.5V7.5C8.75 7.08579 8.41421 6.75 8 6.75C7.58579 6.75 7.25 7.08579 7.25 7.5V11.5C7.25 11.9142 7.58579 12.25 8 12.25Z" fill="currentColor"/>
                          <path d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16Z" fill="currentColor"/>
                        </svg>
                        <p className="text-xs text-gray-500">
                          {enhancedFilter.description || filter.description || `Filter ${getFormattedEndpointName()} by ${filter.name.toLowerCase()}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-500">
                  No filters available for this endpoint.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-zenhr-blue">Pagination</h3>
            
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Control how many records are returned per page and which page to retrieve.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pagination.page}
                    onChange={(e) => handlePaginationChange('page', parseInt(e.target.value) || 1)}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">The page number to retrieve</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Records Per Page
                  </label>
                  <select
                    value={pagination.per_page}
                    onChange={(e) => handlePaginationChange('per_page', parseInt(e.target.value))}
                    className="select"
                  >
                    <option value={10}>10 records</option>
                    <option value={25}>25 records</option>
                    <option value={50}>50 records</option>
                    <option value={100}>100 records</option>
                    <option value={250}>250 records</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Number of records to return per page</p>
                </div>
              </div>
              
              {renderPaginationInfo()}
            </div>
          </div>
        </>
      )}

      {/* Info panel */}
      <div className="alert alert-info">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Tips for Effective Filtering</h4>
            <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Use specific filters to narrow down results and improve API performance</li>
              <li>Date filters accept ISO 8601 format (YYYY-MM-DD)</li>
              <li>Leave filters empty if you don't want to filter by that field</li>
              <li>For large datasets, use pagination to retrieve data in manageable chunks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFilters;