// src/components/steps/ExternalEndpointConfig.js
import React, { useState, useEffect } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const ExternalEndpointConfig = () => {
  const {
    integrationDirection,
    externalSystem,
    setExternalSystem,
    setExternalSystemFields
  } = useIntegration();

  const [testStatus, setTestStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchSchema, setFetchSchema] = useState(true);

  // Handle endpoint info update
  const handleEndpointChange = (field, value) => {
    setExternalSystem({
      ...externalSystem,
      [field]: value
    });
  };

  // Handle auth info update
  const handleAuthChange = (field, value) => {
    setExternalSystem({
      ...externalSystem,
      auth: {
        ...externalSystem.auth,
        [field]: value
      }
    });
  };

  // Handle auth type change
  const handleAuthTypeChange = (type) => {
    // Reset auth details when changing type
    setExternalSystem({
      ...externalSystem,
      auth: {
        type,
        username: '',
        password: '',
        token: '',
        key: '',
        value: ''
      }
    });
  };

  // Test the external API connection
  const testConnection = async () => {
    setIsLoading(true);
    setTestStatus(null);
    
    try {
      // In a real implementation, this would make an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setTestStatus({
        success: true,
        message: 'Successfully connected to the external API'
      });
      
      if (fetchSchema) {
        // Here we'd normally fetch the fields schema from the API
        // For this demo, we'll simulate some fields
        const mockFields = [
          { id: 'ext_id', name: 'ID', type: 'string' },
          { id: 'ext_name', name: 'Name', type: 'string' },
          { id: 'ext_email', name: 'Email Address', type: 'string' },
          { id: 'ext_created_at', name: 'Created Date', type: 'date' },
          { id: 'ext_status', name: 'Status', type: 'string' },
          { id: 'ext_department', name: 'Department', type: 'string' },
          { id: 'ext_salary', name: 'Salary', type: 'number' }
        ];
        
        setExternalSystemFields(mockFields);
      }
    } catch (error) {
      setTestStatus({
        success: false,
        message: 'Failed to connect to the external API. Please check your configuration.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to validate form before testing
  const isFormValid = () => {
    const { baseUrl, endpoint, auth } = externalSystem;
    
    if (!baseUrl || !endpoint) return false;
    
    // Validate auth based on type
    switch (auth.type) {
      case 'none':
        return true;
      case 'basic':
        return !!auth.username && !!auth.password;
      case 'bearer':
        return !!auth.token;
      case 'api_key':
        return !!auth.key && !!auth.value;
      default:
        return false;
    }
  };

  // Render authentication form based on selected type
  const renderAuthForm = () => {
    const { auth } = externalSystem;
    
    switch (auth.type) {
      case 'basic':
        return (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={auth.username || ''}
                onChange={(e) => handleAuthChange('username', e.target.value)}
                placeholder="API username"
                className="input"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={auth.password || ''}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                  placeholder="API password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      case 'bearer':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Bearer Token</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={auth.token || ''}
                onChange={(e) => handleAuthChange('token', e.target.value)}
                placeholder="Bearer token"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
        
      case 'api_key':
        return (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">API Key Name</label>
              <input
                type="text"
                value={auth.key || ''}
                onChange={(e) => handleAuthChange('key', e.target.value)}
                placeholder="Header name (e.g. X-API-Key)"
                className="input"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">API Key Value</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={auth.value || ''}
                  onChange={(e) => handleAuthChange('value', e.target.value)}
                  placeholder="API key value"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <p className="text-sm text-gray-600">
            No authentication will be used for API requests.
          </p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">External System Configuration</h2>
        <p className="text-gray-600 mb-4">
          {integrationDirection === 'zenhr_to_external'
            ? 'Configure the external system API that ZenHR will connect to.'
            : 'Configure the external system API that will connect to ZenHR.'}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue">Endpoint Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              System Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={externalSystem.name || ''}
              onChange={(e) => handleEndpointChange('name', e.target.value)}
              placeholder="E.g., Salesforce, SAP, Custom System"
              className="input"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Base URL
              <span className="text-red-700">*</span>
            </label>
            <input
              type="url"
              value={externalSystem.baseUrl || ''}
              onChange={(e) => handleEndpointChange('baseUrl', e.target.value)}
              placeholder="https://api.example.com"
              className="input"
              required
            />
            <p className="text-xs text-gray-500">The base URL of the external API (without endpoints)</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              API Endpoint
              <span className="text-red-700">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {externalSystem.baseUrl || 'https://api.example.com'}
              </span>
              <input
                type="text"
                value={externalSystem.endpoint || ''}
                onChange={(e) => handleEndpointChange('endpoint', e.target.value)}
                placeholder="/employees"
                className="input rounded-l-none flex-1"
                required
              />
            </div>
            <p className="text-xs text-gray-500">The specific endpoint for {integrationDirection === 'zenhr_to_external' ? 'sending' : 'receiving'} data</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">HTTP Method</label>
            <select
              value={externalSystem.method || 'GET'}
              onChange={(e) => handleEndpointChange('method', e.target.value)}
              className="select"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue">Authentication</h3>
        
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Authentication Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['none', 'basic', 'bearer', 'api_key'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`p-2 text-sm border rounded-md ${
                      externalSystem.auth?.type === type 
                        ? 'bg-zenhr-blue text-white border-zenhr-blue' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleAuthTypeChange(type)}
                  >
                    {type === 'none' ? 'None' : 
                     type === 'basic' ? 'Basic Auth' : 
                     type === 'bearer' ? 'Bearer Token' : 
                     'API Key'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {renderAuthForm()}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue">API Schema Discovery</h3>
        
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="fetchSchema"
              checked={fetchSchema}
              onChange={() => setFetchSchema(!fetchSchema)}
              className="mr-2"
            />
            <label htmlFor="fetchSchema" className="text-sm text-gray-700">
              Automatically discover fields from API (if supported)
            </label>
          </div>
          
          {!fetchSchema && (
            <div className="alert alert-warning">
              <div className="flex">
                <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 6.66663V9.99996" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 13.3334H10.0083" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm text-yellow-700">
                    You'll need to manually define the external system's fields in the next step if automatic discovery is disabled.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test connection button */}
      <div className="flex justify-center py-4">
        <button
          onClick={testConnection}
          disabled={isLoading || !isFormValid()}
          className={`btn btn-lg ${
            !isFormValid()
              ? 'btn-disabled'
              : isLoading
                ? 'btn-disabled'
                : 'btn-primary'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing Connection...
            </div>
          ) : (
            <>
              <svg className="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 10H12.5L10.8333 15L9.16667 5L7.5 10H2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Test Connection
            </>
          )}
        </button>
      </div>

      {/* Test result */}
      {testStatus && (
        <div className={`alert ${testStatus.success ? 'alert-success' : 'alert-error'}`}>
          <div className="flex">
            <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke={testStatus.success ? "#15803D" : "#B91C1C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              {testStatus.success ? (
                <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <>
                  <path d="M12.5 7.5L7.5 12.5" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 7.5L12.5 12.5" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
            </svg>
            <div>
              <h4 className={`font-medium ${testStatus.success ? 'text-green-700' : 'text-red-700'} mb-1`}>
                {testStatus.success ? 'Connection Successful' : 'Connection Failed'}
              </h4>
              <p className={`text-sm ${testStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                {testStatus.message}
              </p>
              {testStatus.success && fetchSchema && (
                <p className="text-sm text-green-700 mt-1">
                  Successfully discovered {7} fields from the API.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help info */}
      <div className="alert alert-info">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">API Configuration Tips</h4>
            <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Ensure the base URL does not include the specific endpoint path</li>
              <li>For API keys, enter the header name (e.g., "X-API-Key") and its value</li>
              <li>The test connection helps verify your settings before proceeding</li>
              <li>If automatic field discovery doesn't work, you can manually define fields</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalEndpointConfig;