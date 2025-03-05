// src/components/steps/SelectEndpoint.js
import React, { useState, useEffect } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';
import { endpoints } from '../../data/schemaData';

const SelectEndpoint = () => {
  const {
    apiKey,
    setApiKey,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedMethod,
    setSelectedMethod
  } = useIntegration();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Set a default API key if not already set (for demo purposes)
  useEffect(() => {
    if (!apiKey) {
      setApiKey('demo_api_key_12345');
    }
    
    // Set a default endpoint if none is selected (for demo purposes)
    if (!selectedEndpoint && endpoints.length > 0) {
      setSelectedEndpoint(endpoints[0].id);
    }
    
    // Set default method if none is selected
    if (!selectedMethod) {
      setSelectedMethod('GET');
    }
  }, [apiKey, selectedEndpoint, selectedMethod, setApiKey, setSelectedEndpoint, setSelectedMethod]);

  // Get unique categories from endpoints
  const categories = ['all', ...new Set(endpoints.map(endpoint => endpoint.category).filter(Boolean))];

  // Filter endpoints by search term and category
  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = 
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get selected endpoint details
  const selectedEndpointDetails = endpoints.find(e => e.id === selectedEndpoint);

  // Get available HTTP methods for selected endpoint
  const getAvailableMethods = (endpointId) => {
    // In a real app, this would come from the API
    // For now, we'll hardcode some common methods for each endpoint
    const methodsByEndpoint = {
      employees: ['GET', 'POST', 'PUT'],
      attendance: ['GET', 'POST'],
      payroll: ['GET'],
      leaves: ['GET', 'POST'],
      documents: ['GET', 'POST'],
      professional_data: ['GET', 'POST'],
      departments: ['GET', 'POST'],
      company_announcements: ['GET', 'POST']
    };
    
    return methodsByEndpoint[endpointId] || ['GET'];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Select API Endpoint & Method</h2>
        <p className="text-gray-600">
          Choose which ZenHR API endpoint you'd like to connect with and the HTTP method to use.
        </p>
      </div>

      <div className="form-group">
        <label className="label">
          API Key
          <span className="text-red-700">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your ZenHR API key"
            className="input pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.25C8.41421 5.25 8.75 4.91421 8.75 4.5C8.75 4.08579 8.41421 3.75 8 3.75C7.58579 3.75 7.25 4.08579 7.25 4.5C7.25 4.91421 7.58579 5.25 8 5.25Z" fill="#6B7280"/>
              <path d="M8 12.25C8.41421 12.25 8.75 11.9142 8.75 11.5V7.5C8.75 7.08579 8.41421 6.75 8 6.75C7.58579 6.75 7.25 7.08579 7.25 7.5V11.5C7.25 11.9142 7.58579 12.25 8 12.25Z" fill="#6B7280"/>
              <path d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16Z" fill="#6B7280"/>
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          You can find your API key in the ZenHR dashboard under Integrations. Your API key is only stored locally.
          <br/>
          <span className="text-zenhr-blue">(For demonstration, a default API key has been set)</span>
        </p>
      </div>

      <div className="form-group">
        <label className="label">Search Endpoints</label>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.3333 11.3333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search endpoints..."
              className="input pl-10"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="label">API Endpoint <span className="text-red-700">*</span></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEndpoints.map(endpoint => (
            <div
              key={endpoint.id}
              className={`radio-container ${selectedEndpoint === endpoint.id ? 'selected' : ''}`}
              onClick={() => setSelectedEndpoint(endpoint.id)}
            >
              <input
                type="radio"
                name="endpoint"
                checked={selectedEndpoint === endpoint.id}
                onChange={() => {}}
                className="radio-input"
              />
              <div className="radio-content">
                <div className="flex items-center mb-1">
                  <label className="radio-label">{endpoint.name}</label>
                  {endpoint.category && (
                    <span className="badge badge-gray text-xs ml-2">{endpoint.category || 'API'}</span>
                  )}
                </div>
                <p className="radio-description">{endpoint.description}</p>
                <div className="text-xs text-gray-500 mt-1">api/v2/{endpoint.id}</div>
              </div>
            </div>
          ))}
        </div>
        {filteredEndpoints.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-md mt-2">
            <p className="text-gray-600">No endpoints found matching your search criteria.</p>
          </div>
        )}
      </div>

      {selectedEndpointDetails && (
        <div className="form-group">
          <label className="label">HTTP Method <span className="text-red-700">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getAvailableMethods(selectedEndpoint).map(method => (
              <div
                key={method}
                className={`radio-container ${selectedMethod === method ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method)}
              >
                <input
                  type="radio"
                  name="method"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => {}}
                  className="radio-input"
                />
                <div className="radio-content">
                  <div className="flex items-center">
                    <span className={`badge ${method === 'GET' ? 'badge-blue' : method === 'POST' ? 'badge-orange' : 'badge-gray'} mr-2`}>
                      {method}
                    </span>
                    <label className="radio-label">
                      {method === 'GET' ? 'Retrieve Data' : 
                       method === 'POST' ? 'Create Data' : 
                       method === 'PUT' ? 'Update Data' : 'Delete Data'}
                    </label>
                  </div>
                  <p className="radio-description">
                    {method === 'GET' ? `Fetch records from the ${selectedEndpointDetails.name} endpoint` : 
                     method === 'POST' ? `Create new records in the ${selectedEndpointDetails.name} endpoint` : 
                     method === 'PUT' ? `Update existing records in the ${selectedEndpointDetails.name} endpoint` : 
                     `Delete records from the ${selectedEndpointDetails.name} endpoint`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEndpointDetails && (
        <div className="alert alert-info">
          <div className="flex">
            <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-sm">
                <span className="font-medium">Documentation:</span> You can find detailed information about the {selectedEndpointDetails.name} endpoint in the 
                <a 
                  href={`https://api-docs.zenhr.com/#${selectedEndpoint}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zenhr-blue font-medium ml-1"
                >
                  ZenHR API Documentation
                </a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectEndpoint;