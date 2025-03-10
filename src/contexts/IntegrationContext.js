// src/contexts/IntegrationContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  fetchEndpoints, 
  fetchEndpointSchema, 
  generateApiRequest 
} from '../services/apiService';
import { 
  getEndpointFields, 
  getEndpointFilters, 
  getRequiredFields, 
  getOptionalFields 
} from '../data/schemaData';

// Create the context
const IntegrationContext = createContext();

// Hook for using the context
export const useIntegration = () => useContext(IntegrationContext);

// Provider component
export const IntegrationProvider = ({ children }) => {
  // Core states
  const [currentStep, setCurrentStep] = useState(0); // Start with direction selection
  const [apiKey, setApiKey] = useState('demo_api_key_12345'); // Default for demo
  const [selectedEndpoint, setSelectedEndpoint] = useState('employees'); // Default for demo
  const [selectedMethod, setSelectedMethod] = useState('GET'); // Default for demo
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [pagination, setPagination] = useState({ page: 1, per_page: 10 });
  const [requiredFields, setRequiredFields] = useState([]);
  const [optionalFields, setOptionalFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [apiRequest, setApiRequest] = useState('');
  const [requestResponse, setRequestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedConfigurations, setSavedConfigurations] = useState([]);
  const [configName, setConfigName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // New states for bidirectional integration
  const [integrationDirection, setIntegrationDirection] = useState('zenhr_to_external'); // 'zenhr_to_external', 'external_to_zenhr', 'bidirectional'
  const [externalSystem, setExternalSystem] = useState({
    name: '',
    baseUrl: '',
    endpoint: '',
    method: 'GET',
    auth: {
      type: 'none', // 'none', 'basic', 'bearer', 'api_key'
      username: '',
      password: '',
      token: '',
      key: '',
      value: ''
    }
  });
  const [externalSystemFields, setExternalSystemFields] = useState([]);
  const [mappedFields, setMappedFields] = useState({});

  // Update available fields when endpoint changes
  useEffect(() => {
    if (selectedEndpoint) {
      // Get fields for the selected endpoint
      const fields = getEndpointFields(selectedEndpoint);
      setAvailableFields(fields);
      
      // For demo purposes, select first 3 fields by default
      if (selectedMethod === 'GET' && fields.length > 0) {
        setSelectedFields(fields.slice(0, 3).map(field => field.id));
      } else {
        setSelectedFields([]);
      }
      
      setFilterValues({});
      
      // Set required and optional fields for POST requests
      setRequiredFields(getRequiredFields(selectedEndpoint));
      setOptionalFields(getOptionalFields(selectedEndpoint));
    } else {
      setAvailableFields([]);
      setRequiredFields([]);
      setOptionalFields([]);
    }
  }, [selectedEndpoint, selectedMethod]);

  // Update field values when required fields change
  useEffect(() => {
    if (selectedMethod === 'POST') {
      // Initialize field values for required fields
      const initialValues = {};
      requiredFields.forEach(field => {
        // Set some default values for demo purposes
        if (field === 'first_name') initialValues[field] = 'John';
        else if (field === 'last_name') initialValues[field] = 'Doe';
        else if (field === 'email') initialValues[field] = 'john.doe@example.com';
        else if (field === 'hire_date') initialValues[field] = '2023-06-15';
        else if (field === 'employee_id') initialValues[field] = '12345';
        else if (field === 'date') initialValues[field] = '2023-06-15';
        else if (field === 'check_in') initialValues[field] = '09:00:00';
        else if (field === 'start_date') initialValues[field] = '2023-06-15';
        else if (field === 'end_date') initialValues[field] = '2023-06-20';
        else if (field === 'leave_type') initialValues[field] = 'annual';
        else if (field === 'period_start') initialValues[field] = '2023-06-01';
        else if (field === 'period_end') initialValues[field] = '2023-06-30';
        else if (field === 'basic_salary') initialValues[field] = '5000';
        else if (field === 'title') initialValues[field] = 'Sample Document';
        else if (field === 'type') initialValues[field] = 'contract';
        else if (field === 'name') initialValues[field] = 'Sample Name';
        else if (field === 'code') initialValues[field] = 'SAMPLE001';
        else if (field === 'content') initialValues[field] = 'Sample content';
        else if (field === 'publish_date') initialValues[field] = '2023-06-15';
        else initialValues[field] = '';
      });
      setFieldValues(initialValues);
    }
  }, [requiredFields, selectedMethod]);

  // Generate API request
  useEffect(() => {
    if ((currentStep === 5 || currentStep === 6) && selectedEndpoint) {
      const request = generateApiRequest({
        method: selectedMethod,
        endpoint: selectedEndpoint,
        fields: selectedFields,
        filters: filterValues,
        pagination,
        fieldValues,
        apiKey
      });
      
      setApiRequest(JSON.stringify(request, null, 2));
    }
  }, [currentStep, selectedEndpoint, selectedMethod, selectedFields, filterValues, pagination, fieldValues, apiKey]);

  // Get steps based on integration direction
  const getSteps = () => {
    if (integrationDirection === 'zenhr_to_external') {
      return [
        { id: 0, label: 'Direction' },
        { id: 1, label: 'ZenHR Endpoint' },
        { id: 2, label: 'Choose Fields' },
        { id: 7, label: 'External System' },
        { id: 9, label: 'Map Fields' },
        { id: 5, label: 'Review' },
        { id: 6, label: 'Test' }
      ];
    } else if (integrationDirection === 'external_to_zenhr') {
      return [
        { id: 0, label: 'Direction' },
        { id: 7, label: 'External System' },
        { id: 8, label: 'Define Fields' },
        { id: 1, label: 'ZenHR Endpoint' },
        { id: 9, label: 'Map Fields' },
        { id: 5, label: 'Review' },
        { id: 6, label: 'Test' }
      ];
    } else { // bidirectional
      return [
        { id: 0, label: 'Direction' },
        { id: 1, label: 'ZenHR Endpoint' },
        { id: 2, label: 'ZenHR Fields' },
        { id: 7, label: 'External System' },
        { id: 8, label: 'External Fields' },
        { id: 9, label: 'Map Fields' },
        { id: 5, label: 'Review' },
        { id: 6, label: 'Test' }
      ];
    }
  };

  // Methods
  const toggleFieldSelection = (fieldId) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(id => id !== fieldId);
      } else {
        return [...prev, fieldId];
      }
    });
  };

  const selectAllFields = () => {
    if (selectedMethod === 'GET') {
      setSelectedFields(availableFields.map(field => field.id));
    } else {
      // For POST, select all optional fields
      setSelectedFields(optionalFields);
    }
  };

  const deselectAllFields = () => {
    if (selectedMethod === 'GET') {
      setSelectedFields([]);
    } else {
      // For POST, we can only deselect optional fields
      setSelectedFields(prev => prev.filter(field => !optionalFields.includes(field)));
    }
  };

  const handleFilterValueChange = (filterId, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handlePaginationChange = (key, value) => {
    setPagination(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFieldValueChange = (fieldId, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const testApiRequest = () => {
    if (!apiKey) {
      setError('API key is required to test the request');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simulate API call (in a real app, you would make an actual API call)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
      
      if (isSuccess) {
        // Generate sample response data based on endpoint and method
        let sampleData;
        
        if (selectedMethod === 'GET') {
          // Sample GET response
          switch (selectedEndpoint) {
            case 'employees':
              sampleData = {
                data: [
                  {
                    id: "12345",
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@example.com",
                    hire_date: "2022-01-15",
                    department: "Engineering",
                    position: "Software Developer",
                    status: "active"
                  },
                  {
                    id: "12346",
                    first_name: "Jane",
                    last_name: "Smith",
                    email: "jane.smith@example.com",
                    hire_date: "2021-06-10",
                    department: "Marketing",
                    position: "Content Manager",
                    status: "active"
                  }
                ],
                meta: {
                  total: 254,
                  page: pagination.page,
                  per_page: pagination.per_page,
                  total_pages: Math.ceil(254 / pagination.per_page)
                }
              };
              break;
            case 'attendance':
              sampleData = {
                data: [
                  {
                    id: "98765",
                    employee_id: "12345",
                    date: "2023-06-12",
                    check_in: "09:00:00",
                    check_out: "17:30:00",
                    status: "present"
                  },
                  {
                    id: "98766",
                    employee_id: "12346",
                    date: "2023-06-12",
                    check_in: "08:50:00",
                    check_out: "17:15:00",
                    status: "present"
                  }
                ],
                meta: {
                  total: 128,
                  page: pagination.page,
                  per_page: pagination.per_page,
                  total_pages: Math.ceil(128 / pagination.per_page)
                }
              };
              break;
            default:
              sampleData = {
                data: [
                  { id: "123", name: "Sample Data 1" },
                  { id: "124", name: "Sample Data 2" }
                ],
                meta: {
                  total: 120,
                  page: pagination.page,
                  per_page: pagination.per_page,
                  total_pages: Math.ceil(120 / pagination.per_page)
                }
              };
          }
        } else {
          // Sample POST response
          switch (selectedEndpoint) {
            case 'employees':
              sampleData = {
                success: true,
                message: "Employee created successfully",
                id: "12347",
                data: {
                  id: "12347",
                  ...fieldValues
                }
              };
              break;
            case 'attendance':
              sampleData = {
                success: true,
                message: "Attendance record created successfully",
                id: "98767",
                data: {
                  id: "98767",
                  ...fieldValues
                }
              };
              break;
            default:
              sampleData = {
                success: true,
                message: "Record created successfully",
                id: "new_record_123",
                data: {
                  id: "new_record_123",
                  ...fieldValues
                }
              };
          }
        }
        
        setRequestResponse({
          status: 200,
          data: sampleData,
          time: Math.floor(Math.random() * 300) + 100 // Random time between 100-400ms
        });
      } else {
        setError('API request failed. Please check your configuration and try again.');
        setRequestResponse({
          status: 400,
          data: { error: 'Bad Request', message: 'Invalid parameters or configuration' },
          time: Math.floor(Math.random() * 300) + 100
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const saveConfiguration = () => {
    if (!configName.trim()) {
      alert('Please enter a name for this configuration');
      return;
    }
    
    const config = {
      id: Date.now().toString(),
      name: configName,
      endpoint: selectedEndpoint,
      method: selectedMethod,
      fields: selectedFields,
      filters: filterValues,
      pagination,
      fieldValues,
      integrationDirection,
      externalSystem,
      externalSystemFields,
      mappedFields
    };
    
    setSavedConfigurations(prev => [...prev, config]);
    setConfigName('');
    setShowSaveModal(false);
  };

  const loadConfiguration = (config) => {
    setSelectedEndpoint(config.endpoint || 'employees');
    setSelectedMethod(config.method || 'GET');
    setSelectedFields(config.fields || []);
    setFilterValues(config.filters || {});
    setPagination(config.pagination || { page: 1, per_page: 10 });
    setFieldValues(config.fieldValues || {});
    setIntegrationDirection(config.integrationDirection || 'zenhr_to_external');
    setExternalSystem(config.externalSystem || {
      name: '',
      baseUrl: '',
      endpoint: '',
      method: 'GET',
      auth: {
        type: 'none',
        username: '',
        password: '',
        token: '',
        key: '',
        value: ''
      }
    });
    setExternalSystemFields(config.externalSystemFields || []);
    setMappedFields(config.mappedFields || {});
    
    // Move to the direction selection step
    setCurrentStep(0);
    setActiveTab(0);
  };

  const handleNext = () => {
    // Get the current step sequence
    const steps = getSteps();
    
    // Find the current step's index in the sequence
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    // Validate current step
    if (currentStep === 0 && !integrationDirection) {
      alert('Please select an integration direction');
      return;
    }
    
    if (currentStep === 1 && !selectedEndpoint) {
      alert('Please select an endpoint');
      return;
    }
    
    if (currentStep === 2 && selectedFields.length === 0 && selectedMethod === 'GET') {
      alert('Please select at least one field');
      return;
    }
    
    if (currentStep === 7) {
      // Validate external system configuration
      if (!externalSystem.baseUrl || !externalSystem.endpoint) {
        alert('Please provide the external system API details');
        return;
      }
    }
    
    if (currentStep === 9 && Object.keys(mappedFields).length === 0) {
      alert('Please map at least one field');
      return;
    }
    
    // Move to next step if not at the end
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    // Get the current step sequence
    const steps = getSteps();
    
    // Find the current step's index in the sequence
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    // Move to previous step if not at the beginning
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  // Add sample saved configurations for demo purposes
  useEffect(() => {
    if (savedConfigurations.length === 0) {
      setSavedConfigurations([
        {
          id: '1',
          name: 'Employee List - Basic Info',
          endpoint: 'employees',
          method: 'GET',
          fields: ['id', 'first_name', 'last_name', 'email', 'department', 'position'],
          filters: { status: 'active' },
          pagination: { page: 1, per_page: 25 },
          integrationDirection: 'zenhr_to_external',
          externalSystem: {
            name: 'Sample CRM',
            baseUrl: 'https://api.samplecrm.com',
            endpoint: '/contacts',
            method: 'POST',
            auth: { type: 'api_key', key: 'X-API-Key', value: 'sample_key_123' }
          },
          mappedFields: {
            'first_name': 'contact_first_name',
            'last_name': 'contact_last_name',
            'email': 'contact_email'
          }
        },
        {
          id: '2',
          name: 'Monthly Attendance Report',
          endpoint: 'attendance',
          method: 'GET',
          fields: ['id', 'employee_id', 'date', 'check_in', 'check_out', 'status'],
          filters: { date_from: '2023-06-01', date_to: '2023-06-30' },
          pagination: { page: 1, per_page: 50 },
          integrationDirection: 'zenhr_to_external',
          externalSystem: {
            name: 'Payroll System',
            baseUrl: 'https://payroll-api.example.com',
            endpoint: '/attendance-records',
            method: 'POST',
            auth: { type: 'bearer', token: 'sample_token_xyz' }
          },
          mappedFields: {
            'employee_id': 'emp_id',
            'date': 'attendance_date',
            'check_in': 'time_in',
            'check_out': 'time_out'
          }
        },
        {
          id: '3',
          name: 'Applicant Import',
          endpoint: 'employees',
          method: 'POST',
          fields: ['department', 'position', 'salary', 'phone', 'address'],
          fieldValues: {
            first_name: 'New',
            last_name: 'Employee',
            email: 'new.employee@example.com',
            hire_date: '2023-06-15',
            department: 'IT',
            position: 'Developer',
            salary: '5000'
          },
          integrationDirection: 'external_to_zenhr',
          externalSystem: {
            name: 'Recruiting Platform',
            baseUrl: 'https://recruiting.example.com',
            endpoint: '/api/applicants',
            method: 'GET',
            auth: { type: 'basic', username: 'apiuser', password: 'apisecret' }
          },
          externalSystemFields: [
            { id: 'applicant_id', name: 'Applicant ID', type: 'string' },
            { id: 'first_name', name: 'First Name', type: 'string' },
            { id: 'last_name', name: 'Last Name', type: 'string' },
            { id: 'email', name: 'Email', type: 'string' },
            { id: 'applied_position', name: 'Applied Position', type: 'string' }
          ],
          mappedFields: {
            'first_name': 'first_name',
            'last_name': 'last_name',
            'email': 'email',
            'position': 'applied_position'
          }
        }
      ]);
    }
  }, [savedConfigurations.length]);

  // Context value
  const contextValue = {
    currentStep,
    setCurrentStep,
    apiKey,
    setApiKey,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedMethod,
    setSelectedMethod,
    availableFields,
    selectedFields,
    toggleFieldSelection,
    selectAllFields,
    deselectAllFields,
    filterValues,
    handleFilterValueChange,
    pagination,
    handlePaginationChange,
    requiredFields,
    optionalFields,
    fieldValues,
    handleFieldValueChange,
    apiRequest,
    requestResponse,
    isLoading,
    error,
    savedConfigurations,
    configName,
    setConfigName,
    saveConfiguration,
    loadConfiguration,
    handleNext,
    handleBack,
    testApiRequest,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    showSaveModal,
    setShowSaveModal,
    getEndpointFilters,
    // New bidirectional integration states and functions
    integrationDirection,
    setIntegrationDirection,
    externalSystem,
    setExternalSystem,
    externalSystemFields,
    setExternalSystemFields,
    mappedFields,
    setMappedFields,
    getSteps
  };

  return (
    <IntegrationContext.Provider value={contextValue}>
      {children}
    </IntegrationContext.Provider>
  );
};

export default IntegrationContext;