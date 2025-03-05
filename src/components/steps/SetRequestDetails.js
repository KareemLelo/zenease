// src/components/steps/SetRequestDetails.js
import React from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

// Sample field validations based on ZenHR API documentation
const fieldValidations = {
  employees: {
    first_name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: "^[a-zA-Z\\s'-]+$",
      description: "First name of the employee"
    },
    last_name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: "^[a-zA-Z\\s'-]+$",
      description: "Last name of the employee"
    },
    email: {
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      description: "Email address must be valid and unique in the system"
    },
    hire_date: {
      required: true,
      description: "The date employee was hired (YYYY-MM-DD)"
    },
    department_id: {
      required: false,
      description: "ID of the department the employee belongs to"
    },
    job_title: {
      required: false,
      maxLength: 100,
      description: "Employee's job title"
    },
    status: {
      required: false,
      options: ["active", "inactive", "on_leave", "terminated"],
      description: "Current employment status"
    },
    phone: {
      required: false,
      pattern: "^\\+?[0-9\\s\\-()]+$",
      description: "Employee's phone number"
    }
  },
  attendance: {
    employee_id: {
      required: true,
      description: "ID of the employee this attendance record belongs to"
    },
    date: {
      required: true,
      description: "Date of attendance (YYYY-MM-DD)"
    },
    check_in: {
      required: true,
      description: "Check-in time (HH:MM:SS)"
    },
    check_out: {
      required: false,
      description: "Check-out time (HH:MM:SS)"
    },
    status: {
      required: false,
      options: ["present", "absent", "late", "early_departure"],
      description: "Attendance status"
    }
  },
  leaves: {
    employee_id: {
      required: true,
      description: "ID of the employee requesting leave"
    },
    start_date: {
      required: true,
      description: "Start date of leave (YYYY-MM-DD)"
    },
    end_date: {
      required: true,
      description: "End date of leave (YYYY-MM-DD)"
    },
    type_id: {
      required: true,
      description: "ID of the leave type (e.g., 1 for annual leave, 2 for sick leave)"
    },
    reason: {
      required: false,
      maxLength: 500,
      description: "Reason for the leave request"
    }
  },
  documents: {
    employee_id: {
      required: true,
      description: "ID of the employee this document belongs to"
    },
    title: {
      required: true,
      maxLength: 100,
      description: "Title of the document"
    },
    type: {
      required: true,
      options: ["contract", "id", "resume", "certificate", "other"],
      description: "Type of document"
    },
    expiry_date: {
      required: false,
      description: "Expiration date of the document (YYYY-MM-DD)"
    }
  }
};

const SetRequestDetails = () => {
    const {
      selectedMethod,
      selectedEndpoint,
      requiredFields,
      fieldValues,
      handleFieldValueChange,
      availableFields,
      selectedFields   // Add thiss missing import
    } = useIntegration();

  // Only needed for POST/PUT requests
  if (selectedMethod === 'GET') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Request Details</h2>
          <p className="text-gray-600 mb-4">
            No additional details needed for GET requests.
          </p>
        </div>
        
        <div className="alert alert-info">
          <div className="flex">
            <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-sm text-blue-700">
                GET requests only require the endpoint, fields, and optional filters you've already configured.
                You can proceed to the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get field details by ID
  const getFieldDetails = (fieldId) => {
    const field = availableFields.find(field => field.id === fieldId) || { name: fieldId, type: 'string' };
    // Get any validation rules from our validation data
    const validationRules = 
      fieldValidations[selectedEndpoint] && 
      fieldValidations[selectedEndpoint][fieldId] || 
      {};
    
    return { ...field, ...validationRules };
  };

  // Format endpoint name for display
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Validate a field value
  const validateField = (fieldId, value) => {
    const field = getFieldDetails(fieldId);
    
    if (field.required && !value) {
      return 'This field is required';
    }
    
    if (field.minLength && value.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }
    
    if (field.maxLength && value.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }
    
    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return 'Invalid format';
    }
    
    return '';
  };

  // Render input field based on field type
  const renderFieldInput = (fieldId) => {
    const field = getFieldDetails(fieldId);
    const value = fieldValues[fieldId] || '';
    const error = validateField(fieldId, value);
    
    switch (field.type) {
      case 'date':
        return (
          <div>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              className={`input ${error ? 'border-red-500' : ''}`}
              required={field.required}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      case 'select':
      case 'enum':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              className={`select ${error ? 'border-red-500' : ''}`}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options && field.options.map(option => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      case 'boolean':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              className={`select ${error ? 'border-red-500' : ''}`}
              required={field.required}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      case 'number':
        return (
          <div>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              className={`input ${error ? 'border-red-500' : ''}`}
              required={field.required}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      case 'textarea':
      case 'text_long':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              className={`input ${error ? 'border-red-500' : ''}`}
              rows={4}
              required={field.required}
            ></textarea>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      case 'array':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              placeholder="Enter comma-separated values"
              className={`input ${error ? 'border-red-500' : ''}`}
              rows={3}
              required={field.required}
            ></textarea>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">Enter values separated by commas</p>
          </div>
        );
      default:
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldValueChange(fieldId, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
              className={`input ${error ? 'border-red-500' : ''}`}
              required={field.required}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Request Details</h2>
        <p className="text-gray-600 mb-4">
          Provide values for the required fields to create a new {getFormattedEndpointName().toLowerCase()} record.
        </p>
      </div>

      {/* Required fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue flex items-center">
          Required Fields
          <span className="badge badge-orange ml-2">{requiredFields.length} Fields</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requiredFields.map(fieldId => {
            const field = getFieldDetails(fieldId);
            
            return (
              <div key={fieldId} className="space-y-1">
                <label className="label flex items-center">
                  {field.name}
                  <span className="text-red-700 ml-1">*</span>
                </label>
                {renderFieldInput(fieldId)}
                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional fields */}
      {selectedFields && selectedFields.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-zenhr-blue flex items-center">
            Optional Fields
            <span className="badge badge-blue ml-2">{selectedFields.length} Selected</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedFields.map(fieldId => {
              const field = getFieldDetails(fieldId);
              
              return (
                <div key={fieldId} className="space-y-1">
                  <label className="label">{field.name}</label>
                  {renderFieldInput(fieldId)}
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info panel */}
      <div className="alert alert-warning">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h4 className="font-medium text-yellow-700 mb-1">Important Note</h4>
            <p className="text-sm text-yellow-700">
              When using this configuration in your system, you'll need to replace these placeholder values with actual data. 
              The values you enter here are for testing and configuration purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Sample request */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="font-medium text-gray-700 mb-2">Sample {selectedMethod} Request</h4>
        <div className="text-xs bg-gray-800 text-white p-3 rounded overflow-auto">
          <pre>{`POST https://api.zenhr.com/api/v2/${selectedEndpoint}
{
  ${requiredFields.map(field => `"${field}": "${fieldValues[field] || '[Required Value]'}"`).join(',\n  ')}${selectedFields.length > 0 ? ',\n  ' : ''}${selectedFields.map(field => `"${field}": "${fieldValues[field] || '[Optional Value]'}"`).join(',\n  ')}
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default SetRequestDetails;