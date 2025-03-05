// src/services/apiService.js

// Mock API service for demo purposes
// In a real application, these functions would make actual API calls to the backend

/**
 * Fetch available endpoints from the API
 * @returns {Promise} Promise resolving to an array of endpoint objects
 */
export const fetchEndpoints = () => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve([
          { id: 'employees', name: 'Employees', description: 'Employee records and personal information' },
          { id: 'attendance', name: 'Attendance', description: 'Employee attendance records' },
          { id: 'payroll', name: 'Payroll', description: 'Payroll data for employees' },
          { id: 'leaves', name: 'Leaves', description: 'Leave requests and time off management' }
        ]);
      }, 300);
    });
  };
  
  /**
   * Fetch schema for a specific endpoint
   * @param {string} endpointId - ID of the endpoint to fetch schema for
   * @returns {Promise} Promise resolving to a schema object
   */
  export const fetchEndpointSchema = (endpointId) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Sample schema data for demonstration
        const schemas = {
          employees: {
            fields: [
              { id: 'id', name: 'ID', type: 'string' },
              { id: 'first_name', name: 'First Name', type: 'string' },
              { id: 'last_name', name: 'Last Name', type: 'string' },
              { id: 'email', name: 'Email', type: 'string' },
              { id: 'hire_date', name: 'Hire Date', type: 'date' },
              { id: 'department', name: 'Department', type: 'string' }
            ],
            filters: [
              { id: 'department', name: 'Department', type: 'string' },
              { id: 'hire_date_from', name: 'Hire Date From', type: 'date' },
              { id: 'hire_date_to', name: 'Hire Date To', type: 'date' }
            ],
            required: ['first_name', 'last_name', 'email', 'hire_date']
          },
          attendance: {
            fields: [
              { id: 'id', name: 'ID', type: 'string' },
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'date', name: 'Date', type: 'date' },
              { id: 'check_in', name: 'Check In', type: 'datetime' },
              { id: 'check_out', name: 'Check Out', type: 'datetime' }
            ],
            filters: [
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'date_from', name: 'Date From', type: 'date' },
              { id: 'date_to', name: 'Date To', type: 'date' }
            ],
            required: ['employee_id', 'date', 'check_in']
          },
          payroll: {
            fields: [
              { id: 'id', name: 'ID', type: 'string' },
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'period_start', name: 'Period Start', type: 'date' },
              { id: 'period_end', name: 'Period End', type: 'date' },
              { id: 'salary', name: 'Salary', type: 'number' },
              { id: 'bonus', name: 'Bonus', type: 'number' }
            ],
            filters: [
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'period_start', name: 'Period Start', type: 'date' },
              { id: 'period_end', name: 'Period End', type: 'date' }
            ],
            required: ['employee_id', 'period_start', 'period_end', 'salary']
          },
          leaves: {
            fields: [
              { id: 'id', name: 'ID', type: 'string' },
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'start_date', name: 'Start Date', type: 'date' },
              { id: 'end_date', name: 'End Date', type: 'date' },
              { id: 'leave_type', name: 'Leave Type', type: 'string' },
              { id: 'status', name: 'Status', type: 'string' }
            ],
            filters: [
              { id: 'employee_id', name: 'Employee ID', type: 'string' },
              { id: 'start_date_from', name: 'Start Date From', type: 'date' },
              { id: 'start_date_to', name: 'Start Date To', type: 'date' },
              { id: 'leave_type', name: 'Leave Type', type: 'string' }
            ],
            required: ['employee_id', 'start_date', 'end_date', 'leave_type']
          }
        };
        
        resolve(schemas[endpointId] || { fields: [], filters: [], required: [] });
      }, 300);
    });
  };
  
  /**
   * Generate an API request based on provided configuration
   * @param {Object} config - Configuration for the request
   * @returns {Object} Request object with URL, method, headers, and body
   */
  export const generateApiRequest = (config) => {
    const { 
      method, 
      endpoint, 
      fields, 
      filters, 
      pagination, 
      fieldValues,
      apiKey
    } = config;
    
    // Base URL
    const baseUrl = 'https://api.zenhr.com/api/v2';
    
    // For GET requests
    if (method === 'GET') {
      // Construct URL with query parameters
      let url = `${baseUrl}/${endpoint}`;
      const params = [];
      
      // Add selected fields
      if (fields && fields.length > 0) {
        params.push(`fields=${fields.join(',')}`);
      }
      
      // Add filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.push(`${key}=${encodeURIComponent(value)}`);
          }
        });
      }
      
      // Add pagination
      if (pagination) {
        params.push(`page=${pagination.page}`);
        params.push(`per_page=${pagination.per_page}`);
      }
      
      // Add params to URL
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      return {
        method: 'GET',
        url,
        headers: {
          'key': apiKey || 'YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      };
    }
    
    // For POST requests
    if (method === 'POST') {
      // Construct request body with field values
      const body = {};
      
      if (fieldValues) {
        Object.entries(fieldValues).forEach(([key, value]) => {
          body[key] = value;
        });
      }
      
      // Add optional fields
      if (fields && fields.length > 0) {
        fields.forEach(field => {
          if (fieldValues[field]) {
            body[field] = fieldValues[field];
          }
        });
      }
      
      return {
        method: 'POST',
        url: `${baseUrl}/${endpoint}`,
        headers: {
          'key': apiKey || 'YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body
      };
    }
  
    // For PUT requests
    if (method === 'PUT') {
      // Similar to POST but for updating existing resources
      const body = {};
      
      // ID is required for PUT requests
      if (fieldValues && fieldValues.id) {
        body.id = fieldValues.id;
        
        // Add other field values
        Object.entries(fieldValues).forEach(([key, value]) => {
          if (key !== 'id') {
            body[key] = value;
          }
        });
      }
      
      return {
        method: 'PUT',
        url: `${baseUrl}/${endpoint}/${body.id || ':id'}`,
        headers: {
          'key': apiKey || 'YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body
      };
    }
    
    return {};
  };
  
  /**
   * Test an API request (mock implementation)
   * @param {Object} request - The request to test
   * @returns {Promise} Promise resolving to the API response
   */
  export const testApiRequest = (request) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Simulate 80% success rate for demo purposes
        const isSuccess = Math.random() > 0.2;
        
        if (isSuccess) {
          // Sample response data based on request type
          let responseData;
          
          if (request.method === 'GET') {
            // Extract endpoint from URL
            const url = request.url;
            const endpointMatch = url.match(/\/api\/v2\/([^?]+)/);
            const endpoint = endpointMatch ? endpointMatch[1] : '';
            
            // Generate sample GET response
            switch (endpoint) {
              case 'employees':
                responseData = {
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
                break;
              case 'attendance':
                responseData = {
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
                break;
              default:
                responseData = {
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
          } else if (request.method === 'POST') {
            // Extract endpoint from URL
            const url = request.url;
            const endpointMatch = url.match(/\/api\/v2\/([^?]+)/);
            const endpoint = endpointMatch ? endpointMatch[1] : '';
            
            // Generate sample POST response
            switch (endpoint) {
              case 'employees':
                responseData = {
                  success: true,
                  message: "Employee created successfully",
                  id: "12347",
                  data: {
                    id: "12347",
                    ...(request.body || {})
                  }
                };
                break;
              case 'attendance':
                responseData = {
                  success: true,
                  message: "Attendance record created successfully",
                  id: "98767",
                  data: {
                    id: "98767",
                    ...(request.body || {})
                  }
                };
                break;
              default:
                responseData = {
                  success: true,
                  message: "Record created successfully",
                  id: "new_record_123",
                  data: {
                    id: "new_record_123",
                    ...(request.body || {})
                  }
                };
            }
          } else {
            // Default response
            responseData = {
              success: true,
              message: "Request processed successfully"
            };
          }
          
          resolve({
            status: 200,
            data: responseData,
            time: Math.floor(Math.random() * 300) + 100 // Random time between 100-400ms
          });
        } else {
          // Sample error response
          reject({
            status: 400,
            data: { 
              error: 'Bad Request', 
              message: 'Invalid parameters or configuration',
              details: [
                "Some required parameters are missing or invalid"
              ]
            },
            time: Math.floor(Math.random() * 300) + 100
          });
        }
      }, 1500);
    });
  };