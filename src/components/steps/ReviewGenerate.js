// src/components/steps/ReviewGenerate.js
import React, { useState } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const ReviewGenerate = () => {
  const {
    selectedEndpoint,
    selectedMethod,
    selectedFields,
    filterValues,
    pagination,
    fieldValues,
    apiRequest,
    apiKey
  } = useIntegration();

  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Copy API request to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format API request with masked API key for display
  const formatDisplayRequest = () => {
    if (!apiRequest) return '';
    
    let displayRequest = apiRequest;
    
    // Mask API key for display
    if (apiKey && !showApiKey) {
      const maskedKey = apiKey.slice(0, 4) + '...' + apiKey.slice(-4);
      displayRequest = displayRequest.replace(new RegExp(apiKey, 'g'), maskedKey);
    }
    
    return displayRequest;
  };

  // Get endpoint display name
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Count active filters
  const activeFiltersCount = Object.values(filterValues).filter(val => val).length;

  // Generate code examples in different languages
  const generateCodeExample = (language) => {
    const baseUrl = `https://api.zenhr.com/api/v2/${selectedEndpoint}`;
    const fields = selectedFields.length > 0 ? selectedFields.join(',') : '';
    
    // Build query params for GET requests
    const buildQueryParams = () => {
      const params = [];
      
      if (fields) {
        params.push(`fields=${fields}`);
      }
      
      // Add filters
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) {
          params.push(`${key}=${encodeURIComponent(value)}`);
        }
      });
      
      // Add pagination
      params.push(`page=${pagination.page}`);
      params.push(`per_page=${pagination.per_page}`);
      
      return params.length > 0 ? `?${params.join('&')}` : '';
    };
    
    // Build request body for POST requests
    const buildRequestBody = () => {
      const body = {};
      
      // Add required fields
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value) {
          body[key] = value;
        }
      });
      
      // Add optional fields
      selectedFields.forEach(field => {
        if (fieldValues[field]) {
          body[field] = fieldValues[field];
        }
      });
      
      return JSON.stringify(body, null, 2);
    };
    
    switch (language) {
      case 'javascript':
        return selectedMethod === 'GET' 
          ? `// JavaScript - Fetch API
fetch('${baseUrl}${buildQueryParams()}', {
  method: 'GET',
  headers: {
    'key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
          : `// JavaScript - Fetch API
fetch('${baseUrl}', {
  method: 'POST',
  headers: {
    'key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: ${buildRequestBody()}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
      
      case 'python':
        return selectedMethod === 'GET' 
          ? `# Python - Requests
import requests

url = '${baseUrl}${buildQueryParams()}'
headers = {
    'key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
          : `# Python - Requests
import requests
import json

url = '${baseUrl}'
headers = {
    'key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
}
payload = ${buildRequestBody()}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`;
      
      case 'php':
        return selectedMethod === 'GET' 
          ? `<?php
// PHP - cURL
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => '${baseUrl}${buildQueryParams()}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'key: YOUR_API_KEY',
    'Content-Type: application/json'
  ]
]);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
print_r($data);
?>`
          : `<?php
// PHP - cURL
$curl = curl_init();

$payload = ${buildRequestBody()};

curl_setopt_array($curl, [
  CURLOPT_URL => '${baseUrl}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    'key: YOUR_API_KEY',
    'Content-Type: application/json'
  ]
]);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
print_r($data);
?>`;
      
      case 'ruby':
        return selectedMethod === 'GET' 
          ? `# Ruby - Net::HTTP
require 'net/http'
require 'json'
require 'uri'

uri = URI('${baseUrl}${buildQueryParams()}')
request = Net::HTTP::Get.new(uri)
request['key'] = 'YOUR_API_KEY'
request['Content-Type'] = 'application/json'

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
  http.request(request)
end

data = JSON.parse(response.body)
puts data`
          : `# Ruby - Net::HTTP
require 'net/http'
require 'json'
require 'uri'

uri = URI('${baseUrl}')
request = Net::HTTP::Post.new(uri)
request['key'] = 'YOUR_API_KEY'
request['Content-Type'] = 'application/json'
request.body = ${buildRequestBody()}

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
  http.request(request)
end

data = JSON.parse(response.body)
puts data`;
      
      case 'curl':
        return selectedMethod === 'GET' 
          ? `# cURL Command
curl -X GET '${baseUrl}${buildQueryParams()}' \\
  -H 'key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`
          : `# cURL Command
curl -X POST '${baseUrl}' \\
  -H 'key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '${buildRequestBody().replace(/\n/g, ' ').replace(/"/g, '\\"')}'`;
      
      default:
        return 'Select a language to see code examples.';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Review & Generate API Request</h2>
        <p className="text-gray-600 mb-4">
          Review your configuration and generate the API request for integration with the ZenHR API.
        </p>
      </div>

      {/* Configuration summary */}
      <div className="p-5 bg-zenhr-blue-lighter rounded-md space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue">Configuration Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Endpoint</div>
                <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                  <span className="font-medium">{getFormattedEndpointName()}</span>
                  <span className="text-gray-500 text-xs block">https://api.zenhr.com/api/v2/{selectedEndpoint}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Method</div>
                <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                  <span className={`badge ${selectedMethod === 'GET' ? 'badge-blue' : 'badge-orange'}`}>
                    {selectedMethod}
                  </span>
                  <span className="text-gray-500 text-xs block mt-1">
                    {selectedMethod === 'GET' ? 'Retrieve data from the API' : 'Create a new record'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Fields</div>
                <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                  <span className="font-medium">{selectedFields.length} fields selected</span>
                  {selectedFields.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedFields.slice(0, 3).map(field => (
                        <span key={field} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {field}
                        </span>
                      ))}
                      {selectedFields.length > 3 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          +{selectedFields.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {selectedMethod === 'GET' && (
                <>
                  <div className="flex space-x-2">
                    <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Filters</div>
                    <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                      <span className="font-medium">{activeFiltersCount} filters applied</span>
                      {activeFiltersCount > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(filterValues)
                            .filter(([_, value]) => value)
                            .slice(0, 3)
                            .map(([key, _]) => (
                              <span key={key} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {key}
                              </span>
                            ))}
                          {activeFiltersCount > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              +{activeFiltersCount - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Pagination</div>
                    <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                      <span className="font-medium">Page {pagination.page}, {pagination.per_page} per page</span>
                    </div>
                  </div>
                </>
              )}
              
              {selectedMethod === 'POST' && Object.keys(fieldValues).length > 0 && (
                <div className="flex space-x-2">
                  <div className="bg-white px-3 py-2 rounded-md w-32 text-sm font-medium text-gray-700">Field Values</div>
                  <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
                    <span className="font-medium">{Object.values(fieldValues).filter(v => v).length} values set</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* API Request */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zenhr-blue">Generated API Request</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="btn btn-sm btn-outline"
            >
              {showApiKey ? 'Hide API Key' : 'Show API Key'}
            </button>
            <button
              onClick={() => copyToClipboard(apiRequest)}
              className="btn btn-sm btn-primary"
            >
              {copied ? (
                <div className="flex items-center">
                  <svg className="mr-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3334 4.66663L6.00008 12L2.66675 8.66663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied!
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="mr-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.66675" y="2.66663" width="8" height="8" rx="1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 6.66663V12.6666C10.6667 13.219 10.219 13.6666 9.66675 13.6666H5.33341C4.78103 13.6666 4.33342 13.219 4.33342 12.6666V8.66663" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copy to Clipboard
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="code-block overflow-auto" style={{ maxHeight: '300px' }}>
          <pre className="text-sm whitespace-pre-wrap">
            {formatDisplayRequest()}
          </pre>
        </div>
      </div>

      {/* Code examples */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-zenhr-blue">Implementation Examples</h3>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex mb-3 space-x-1">
            {['javascript', 'python', 'php', 'ruby', 'curl'].map(lang => (
              <button 
                key={lang}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  selectedLanguage === lang 
                    ? 'bg-zenhr-blue text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="code-block overflow-auto">
            <pre className="text-sm whitespace-pre">
              {generateCodeExample(selectedLanguage)}
            </pre>
          </div>
          
          <div className="flex justify-end mt-3">
            <button
              onClick={() => copyToClipboard(generateCodeExample(selectedLanguage))}
              className="btn btn-sm btn-outline"
            >
              <svg className="mr-1" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.66675" y="2.66663" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 6.66663V12.6666C10.6667 13.219 10.219 13.6666 9.66675 13.6666H5.33341C4.78103 13.6666 4.33342 13.219 4.33342 12.6666V8.66663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copy Example
            </button>
          </div>
        </div>
      </div>

      {/* API documentation */}
      <div className="alert alert-info">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Next Steps</h4>
            <p className="text-sm text-blue-700">
              Proceed to the next step to test your API request, or refer to the 
              <a 
                href={`https://api-docs.zenhr.com/#${selectedEndpoint}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zenhr-blue font-medium mx-1 underline"
              >
                ZenHR API Documentation
              </a> 
              for more details about the {getFormattedEndpointName()} endpoint.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Remember to save this configuration for future use by clicking the "Save Configuration" button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewGenerate;