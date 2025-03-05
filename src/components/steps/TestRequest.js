// src/components/steps/TestRequest.js
import React, { useState } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const TestRequest = () => {
  const {
    selectedEndpoint,
    selectedMethod,
    apiKey,
    requestResponse,
    isLoading,
    error,
    testApiRequest,
    selectedFields,
    apiRequest,
    fieldValues   // Add this missing import
  } = useIntegration();

  const [showFullResponse, setShowFullResponse] = useState(false);
  
  // Get endpoint display name
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format HTTP status with color
  const formatHttpStatus = (status) => {
    if (status >= 200 && status < 300) {
      return <span className="text-green-700 font-medium">{status} OK</span>;
    } else if (status >= 400 && status < 500) {
      return <span className="text-red-700 font-medium">{status} Error</span>;
    } else if (status >= 500) {
      return <span className="text-red-700 font-medium">{status} Server Error</span>;
    }
    return <span className="font-medium">{status}</span>;
  };

  // Format response time with color
  const formatResponseTime = (time) => {
    if (time < 200) {
      return <span className="text-green-700">{time}ms</span>;
    } else if (time < 500) {
      return <span className="text-yellow-700">{time}ms</span>;
    } else {
      return <span className="text-red-700">{time}ms</span>;
    }
  };

  // Get sample response data based on endpoint and method
  const getSampleResponseData = () => {
    if (selectedMethod === 'GET') {
      switch (selectedEndpoint) {
        case 'employees':
          return {
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
              page: 1,
              per_page: 10,
              total_pages: 26
            }
          };
        case 'attendance':
          return {
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
              page: 1,
              per_page: 10,
              total_pages: 13
            }
          };
        default:
          return {
            data: [
              { id: "123", name: "Sample Data 1" },
              { id: "124", name: "Sample Data 2" }
            ],
            meta: {
              total: 120,
              page: 1,
              per_page: 10,
              total_pages: 12
            }
          };
      }
    } else {
      // POST response
      switch (selectedEndpoint) {
        case 'employees':
          return {
            success: true,
            message: "Employee created successfully",
            id: "12347",
            data: {
              id: "12347",
              first_name: "New",
              last_name: "Employee",
              email: "new.employee@example.com",
              hire_date: "2023-06-15",
              department: "IT",
              position: "System Administrator",
              status: "active"
            }
          };
        case 'attendance':
          return {
            success: true,
            message: "Attendance record created successfully",
            id: "98767",
            data: {
              id: "98767",
              employee_id: "12345",
              date: "2023-06-13",
              check_in: "09:05:00",
              status: "present"
            }
          };
        default:
          return {
            success: true,
            message: "Record created successfully",
            id: "new_record_123"
          };
      }
    }
  };

  const renderResponseData = () => {
    const responseData = requestResponse ? requestResponse.data : getSampleResponseData();
    
    if (selectedMethod === 'GET') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Response Summary</h4>
              <div className="p-3 bg-white rounded-md border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Records:</span>
                    <span className="text-sm font-medium">{responseData.meta.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Page:</span>
                    <span className="text-sm font-medium">{responseData.meta.page} of {responseData.meta.total_pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Records Per Page:</span>
                    <span className="text-sm font-medium">{responseData.meta.per_page}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Records Returned:</span>
                    <span className="text-sm font-medium">{responseData.data.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Sample Record</h4>
              <div className="p-3 bg-white rounded-md border border-gray-200 overflow-auto" style={{ maxHeight: '150px' }}>
                {responseData.data.length > 0 && (
                  <pre className="text-xs">
                    {JSON.stringify(responseData.data[0], null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Response Data</h4>
              <button
                onClick={() => setShowFullResponse(!showFullResponse)}
                className="btn btn-xs btn-outline"
              >
                {showFullResponse ? 'Show Less' : 'Show Full Response'}
              </button>
            </div>
            <div className="code-block overflow-auto" style={{ maxHeight: '300px' }}>
              <pre className="text-sm">
                {JSON.stringify(showFullResponse ? responseData : {
                  data: responseData.data.slice(0, 2),
                  meta: responseData.meta,
                  note: responseData.data.length > 2 ? `... ${responseData.data.length - 2} more records (click "Show Full Response" to see all)` : ''
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      );
    } else {
      // POST response
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Response Summary</h4>
              <div className="p-3 bg-white rounded-md border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-700">{responseData.success ? 'Success' : 'Failed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created ID:</span>
                    <span className="text-sm font-medium">{responseData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Message:</span>
                    <span className="text-sm font-medium">{responseData.message}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Created Record</h4>
              <div className="p-3 bg-white rounded-md border border-gray-200 overflow-auto" style={{ maxHeight: '150px' }}>
                <pre className="text-xs">
                  {JSON.stringify(responseData.data || { id: responseData.id }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Full Response</h4>
            <div className="code-block overflow-auto" style={{ maxHeight: '200px' }}>
              <pre className="text-sm">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Test API Request</h2>
        <p className="text-gray-600 mb-4">
          Test your {getFormattedEndpointName()} API configuration to verify it works as expected.
        </p>
      </div>

      {/* Request details */}
      <div className="p-5 bg-zenhr-blue-lighter rounded-md">
        <h3 className="text-lg font-semibold text-zenhr-blue mb-4">Request Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-md border border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-700">Endpoint</h4>
              <span className="badge badge-blue">{selectedMethod}</span>
            </div>
            <p className="text-sm mt-1">
              <span className="font-medium">{getFormattedEndpointName()}</span>
              <span className="text-gray-500 text-xs block mt-1">
                https://api.zenhr.com/api/v2/{selectedEndpoint}
              </span>
            </p>
          </div>
          
          <div className="p-3 bg-white rounded-md border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Authentication</h4>
            <div className="flex items-center mt-1">
              <span className="text-sm">API Key:</span>
              <span className="ml-2">
                {apiKey ? (
                  <span className="badge badge-blue">
                    {apiKey.substring(0, 4)}...{apiKey.substring(apiKey.length - 4)}
                  </span>
                ) : (
                  <span className="badge badge-orange">Missing</span>
                )}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-md border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Request Data</h4>
            <div className="flex flex-col mt-1 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fields:</span>
                <span className="text-sm">{selectedFields.length} selected</span>
              </div>
              {selectedMethod === 'POST' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Field Values:</span>
                  <span className="text-sm">{Object.values(fieldValues || {}).filter(v => v).length} provided</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-md border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Status</h4>
            <div className="flex flex-col mt-1 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ready to Test:</span>
                <span className="text-sm font-medium">
                  {apiKey ? (
                    <span className="text-green-700">Yes</span>
                  ) : (
                    <span className="text-red-700">No (API key required)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test button */}
      <div className="flex justify-center py-4">
        <button
          onClick={testApiRequest}
          disabled={isLoading || !apiKey}
          className={`btn btn-lg ${
            !apiKey
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
              Testing API Request...
            </div>
          ) : (
            <>
              <svg className="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.74984 15.8333L4.1665 11.25L5.58317 9.83334L8.74984 13L14.4165 7.33334L15.8332 8.75001L8.74984 15.8333Z" fill="white"/>
                <path d="M10.0002 18.3333C14.6025 18.3333 18.3335 14.6024 18.3335 10C18.3335 5.39763 14.6025 1.66667 10.0002 1.66667C5.39777 1.66667 1.6668 5.39763 1.6668 10C1.6668 14.6024 5.39777 18.3333 10.0002 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Test API Request
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          <div className="flex">
            <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6.66663V9.99996" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 13.3334H10.0083" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h4 className="font-medium text-red-700 mb-1">Error Occurred</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Response preview */}
      {(requestResponse || !isLoading) && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-zenhr-blue">
              {requestResponse ? 'Response' : 'Sample Response'}
            </h3>
            {requestResponse && (
              <div className="flex space-x-4 items-center text-sm">
                <div>
                  <span className="text-gray-600 mr-1">Status:</span>
                  {formatHttpStatus(requestResponse.status)}
                </div>
                <div>
                  <span className="text-gray-600 mr-1">Time:</span>
                  {formatResponseTime(requestResponse.time)}
                </div>
              </div>
            )}
          </div>
          
          {requestResponse ? (
            <div className="p-4 border border-gray-200 rounded-md bg-white">
              {renderResponseData()}
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-md bg-white">
              <div className="alert alert-info mb-4">
                <div className="flex">
                  <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700">
                      This is a sample response to show what data you can expect. Click the "Test API Request" button above to see actual results.
                    </p>
                  </div>
                </div>
              </div>
              {renderResponseData()}
            </div>
          )}
          
          {requestResponse && requestResponse.status >= 200 && requestResponse.status < 300 && (
            <div className="alert alert-success">
              <div className="flex">
                <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h4 className="font-medium text-green-700 mb-1">Success!</h4>
                  <p className="text-sm text-green-700">
                    Your {getFormattedEndpointName()} API request was successful. You can now use this configuration in your applications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
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
            <h4 className="font-medium text-blue-700 mb-1">Congratulations!</h4>
            <p className="text-sm text-blue-700">
              You've successfully configured a ZenHR API integration. Remember to save your configuration if you haven't already.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              For production use, ensure proper error handling and authentication in your implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRequest;