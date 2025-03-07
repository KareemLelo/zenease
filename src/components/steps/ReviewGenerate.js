import React, { useState, useEffect } from 'react';
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
    apiKey,
    integrationDirection,
    externalSystem,
    externalSystemFields,
    mappedFields
  } = useIntegration();

  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showExternalAuth, setShowExternalAuth] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('zenhr_to_external');
  const [generatedCode, setGeneratedCode] = useState({
    zenhrToExternal: '',
    externalToZenhr: ''
  });

  // Generate the code examples on component mount or when dependencies change
  useEffect(() => {
    const zenhrToExternalCode = generateZenhrToExternalCode(selectedLanguage);
    const externalToZenhrCode = generateExternalToZenhrCode(selectedLanguage);
    
    setGeneratedCode({
      zenhrToExternal: zenhrToExternalCode,
      externalToZenhr: externalToZenhrCode
    });
  }, [selectedLanguage, selectedEndpoint, selectedFields, externalSystem, mappedFields]);

  // Copy to clipboard
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

  // Format external auth credentials for display
  const formatExternalAuth = () => {
    const { auth } = externalSystem;
    
    if (!auth) return '';
    
    let authDisplay = JSON.stringify(auth, null, 2);
    
    if (!showExternalAuth) {
      // Mask sensitive information
      if (auth.password) {
        authDisplay = authDisplay.replace(new RegExp(`"${auth.password}"`, 'g'), '"********"');
      }
      if (auth.token) {
        authDisplay = authDisplay.replace(new RegExp(`"${auth.token}"`, 'g'), '"********"');
      }
      if (auth.value) {
        authDisplay = authDisplay.replace(new RegExp(`"${auth.value}"`, 'g'), '"********"');
      }
    }
    
    return authDisplay;
  };

  // Get ZenHR endpoint display name
  const getZenhrEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get the number of mapped fields
  const getMappedFieldsCount = () => {
    return Object.keys(mappedFields).length;
  };

  // Get the number of active filters
  const getActiveFiltersCount = () => {
    return Object.values(filterValues).filter(val => val).length;
  };

  // Generate code for ZenHR to External System direction
  const generateZenhrToExternalCode = (language) => {
    const baseZenhrUrl = `https://api.zenhr.com/api/v2/${selectedEndpoint}`;
    const externalUrl = `${externalSystem.baseUrl}${externalSystem.endpoint}`;
    
    // Build query params for GET requests
    const buildZenhrQueryParams = () => {
      const params = [];
      
      if (selectedFields.length > 0) {
        params.push(`fields=${selectedFields.join(',')}`);
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
    
    // Generate field mapping code
    const generateFieldMappingCode = (language) => {
      const mappingCode = [];
      
      switch (language) {
        case 'javascript':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`  ${externalField}: data.${zenhrField}`);
          });
          return mappingCode.join(',\n');
          
        case 'python':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`    "${externalField}": data["${zenhrField}"]`);
          });
          return mappingCode.join(',\n');
          
        case 'php':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`  "${externalField}" => $data["${zenhrField}"]`);
          });
          return mappingCode.join(',\n');
          
        default:
          return '';
      }
    };
    
    // Generate authentication code for external system
    const generateExternalAuthCode = (language) => {
      const { auth } = externalSystem;
      
      switch (language) {
        case 'javascript':
          switch (auth.type) {
            case 'basic':
              return `  'Authorization': 'Basic ' + Buffer.from('${auth.username}:${auth.password}').toString('base64'),`;
            case 'bearer':
              return `  'Authorization': 'Bearer ${auth.token}',`;
            case 'api_key':
              return `  '${auth.key}': '${auth.value}',`;
            default:
              return '';
          }
          
        case 'python':
          switch (auth.type) {
            case 'basic':
              return `    "Authorization": "Basic " + base64.b64encode(f"${auth.username}:${auth.password}".encode()).decode(),`;
            case 'bearer':
              return `    "Authorization": "Bearer ${auth.token}",`;
            case 'api_key':
              return `    "${auth.key}": "${auth.value}",`;
            default:
              return '';
          }
          
        case 'php':
          switch (auth.type) {
            case 'basic':
              return `  "Authorization: Basic " . base64_encode("${auth.username}:${auth.password}"),`;
            case 'bearer':
              return `  "Authorization: Bearer ${auth.token}",`;
            case 'api_key':
              return `  "${auth.key}: ${auth.value}",`;
            default:
              return '';
          }
          
        default:
          return '';
      }
    };
    
    switch (language) {
      case 'javascript':
        return `// JavaScript - ZenHR to External System Integration
const fetchFromZenHRAndSendToExternal = async () => {
  try {
    // 1. Fetch data from ZenHR API
    const zenhrResponse = await fetch('${baseZenhrUrl}${buildZenhrQueryParams()}', {
      method: 'GET',
      headers: {
        'key': 'YOUR_ZENHR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    if (!zenhrResponse.ok) {
      throw new Error(\`ZenHR API responded with status: \${zenhrResponse.status}\`);
    }
    
    const zenhrData = await zenhrResponse.json();
    
    // 2. Process each record from ZenHR
    for (const data of zenhrData.data) {
      // Map ZenHR fields to external system fields
      const mappedData = {
${generateFieldMappingCode('javascript')}
      };
      
      // 3. Send mapped data to external system
      const externalResponse = await fetch('${externalUrl}', {
        method: '${externalSystem.method}',
        headers: {
${generateExternalAuthCode('javascript')}
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mappedData)
      });
      
      if (!externalResponse.ok) {
        throw new Error(\`External API responded with status: \${externalResponse.status}\`);
      }
      
      console.log('Successfully synced record to external system:', await externalResponse.json());
    }
    
    console.log('Data sync completed successfully!');
  } catch (error) {
    console.error('Error during data sync:', error);
  }
};

// Call the function to start the sync
fetchFromZenHRAndSendToExternal();`;
        
      case 'python':
        return `# Python - ZenHR to External System Integration
import requests
import json
import base64

def fetch_from_zenhr_and_send_to_external():
    try:
        # 1. Fetch data from ZenHR API
        zenhr_url = '${baseZenhrUrl}${buildZenhrQueryParams()}'
        zenhr_headers = {
            'key': 'YOUR_ZENHR_API_KEY',
            'Content-Type': 'application/json'
        }
        
        zenhr_response = requests.get(zenhr_url, headers=zenhr_headers)
        zenhr_response.raise_for_status()  # Raise exception for non-2xx status codes
        
        zenhr_data = zenhr_response.json()
        
        # 2. Process each record from ZenHR
        for data in zenhr_data['data']:
            # Map ZenHR fields to external system fields
            mapped_data = {
${generateFieldMappingCode('python')}
            }
            
            # 3. Send mapped data to external system
            external_headers = {
${generateExternalAuthCode('python')}
                'Content-Type': 'application/json'
            }
            
            external_response = requests.${externalSystem.method.toLowerCase()}(
                '${externalUrl}',
                headers=external_headers,
                json=mapped_data
            )
            external_response.raise_for_status()
            
            print(f"Successfully synced record to external system: {external_response.json()}")
        
        print("Data sync completed successfully!")
    except Exception as error:
        print(f"Error during data sync: {error}")

# Call the function to start the sync
if __name__ == "__main__":
    fetch_from_zenhr_and_send_to_external()`;
        
      case 'php':
        return `<?php
// PHP - ZenHR to External System Integration

/**
 * Function to fetch data from ZenHR and send to external system
 */
function fetchFromZenHRAndSendToExternal() {
    try {
        // 1. Fetch data from ZenHR API
        $zenhrUrl = '${baseZenhrUrl}${buildZenhrQueryParams()}';
        $zenhrHeaders = [
            'key: YOUR_ZENHR_API_KEY',
            'Content-Type: application/json'
        ];
        
        $zenhrCurl = curl_init();
        curl_setopt_array($zenhrCurl, [
            CURLOPT_URL => $zenhrUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $zenhrHeaders
        ]);
        
        $zenhrResponse = curl_exec($zenhrCurl);
        $zenhrHttpCode = curl_getinfo($zenhrCurl, CURLINFO_HTTP_CODE);
        curl_close($zenhrCurl);
        
        if ($zenhrHttpCode < 200 || $zenhrHttpCode >= 300) {
            throw new Exception("ZenHR API responded with status: " . $zenhrHttpCode);
        }
        
        $zenhrData = json_decode($zenhrResponse, true);
        
        // 2. Process each record from ZenHR
        foreach ($zenhrData['data'] as $data) {
            // Map ZenHR fields to external system fields
            $mappedData = [
${generateFieldMappingCode('php')}
            ];
            
            // 3. Send mapped data to external system
            $externalUrl = '${externalUrl}';
            $externalHeaders = [
${generateExternalAuthCode('php')}
                'Content-Type: application/json'
            ];
            
            $externalCurl = curl_init();
            curl_setopt_array($externalCurl, [
                CURLOPT_URL => $externalUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => $externalHeaders,
                CURLOPT_CUSTOMREQUEST => '${externalSystem.method}',
                CURLOPT_POSTFIELDS => json_encode($mappedData)
            ]);
            
            $externalResponse = curl_exec($externalCurl);
            $externalHttpCode = curl_getinfo($externalCurl, CURLINFO_HTTP_CODE);
            curl_close($externalCurl);
            
            if ($externalHttpCode < 200 || $externalHttpCode >= 300) {
                throw new Exception("External API responded with status: " . $externalHttpCode);
            }
            
            echo "Successfully synced record to external system: " . $externalResponse . "\n";
        }
        
        echo "Data sync completed successfully!\n";
    } catch (Exception $error) {
        echo "Error during data sync: " . $error->getMessage() . "\n";
    }
}

// Call the function to start the sync
fetchFromZenHRAndSendToExternal();
?>`;
        
      default:
        return 'Select a language to see code examples.';
    }
  };

  // Generate code for External System to ZenHR direction
  const generateExternalToZenhrCode = (language) => {
    const zenhrUrl = `https://api.zenhr.com/api/v2/${selectedEndpoint}`;
    const externalUrl = `${externalSystem.baseUrl}${externalSystem.endpoint}`;
    
    // Generate field mapping code
    const generateFieldMappingCode = (language) => {
      const mappingCode = [];
      
      switch (language) {
        case 'javascript':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`  ${zenhrField}: data.${externalField}`);
          });
          return mappingCode.join(',\n');
          
        case 'python':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`    "${zenhrField}": data["${externalField}"]`);
          });
          return mappingCode.join(',\n');
          
        case 'php':
          Object.entries(mappedFields).forEach(([zenhrField, externalField]) => {
            mappingCode.push(`  "${zenhrField}" => $data["${externalField}"]`);
          });
          return mappingCode.join(',\n');
          
        default:
          return '';
      }
    };
    
    // Generate authentication code for external system
    const generateExternalAuthCode = (language) => {
      const { auth } = externalSystem;
      
      switch (language) {
        case 'javascript':
          switch (auth.type) {
            case 'basic':
              return `  'Authorization': 'Basic ' + Buffer.from('${auth.username}:${auth.password}').toString('base64'),`;
            case 'bearer':
              return `  'Authorization': 'Bearer ${auth.token}',`;
            case 'api_key':
              return `  '${auth.key}': '${auth.value}',`;
            default:
              return '';
          }
          
        case 'python':
          switch (auth.type) {
            case 'basic':
              return `    "Authorization": "Basic " + base64.b64encode(f"${auth.username}:${auth.password}".encode()).decode(),`;
            case 'bearer':
              return `    "Authorization": "Bearer ${auth.token}",`;
            case 'api_key':
              return `    "${auth.key}": "${auth.value}",`;
            default:
              return '';
          }
          
        case 'php':
          switch (auth.type) {
            case 'basic':
              return `  "Authorization: Basic " . base64_encode("${auth.username}:${auth.password}"),`;
            case 'bearer':
              return `  "Authorization: Bearer ${auth.token}",`;
            case 'api_key':
              return `  "${auth.key}: ${auth.value}",`;
            default:
              return '';
          }
          
        default:
          return '';
      }
    };
    
    switch (language) {
      case 'javascript':
        return `// JavaScript - External System to ZenHR Integration
const fetchFromExternalAndSendToZenHR = async () => {
  try {
    // 1. Fetch data from external system
    const externalResponse = await fetch('${externalUrl}', {
      method: '${externalSystem.method}',
      headers: {
${generateExternalAuthCode('javascript')}
        'Content-Type': 'application/json'
      }
    });
    
    if (!externalResponse.ok) {
      throw new Error(\`External API responded with status: \${externalResponse.status}\`);
    }
    
    const externalData = await externalResponse.json();
    
    // 2. Process each record from external system
    for (const data of externalData.data || [externalData]) {
      // Map external fields to ZenHR fields
      const mappedData = {
${generateFieldMappingCode('javascript')}
      };
      
      // 3. Send mapped data to ZenHR
      const zenhrResponse = await fetch('${zenhrUrl}', {
        method: 'POST',
        headers: {
          'key': 'YOUR_ZENHR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mappedData)
      });
      
      if (!zenhrResponse.ok) {
        throw new Error(\`ZenHR API responded with status: \${zenhrResponse.status}\`);
      }
      
      console.log('Successfully synced record to ZenHR:', await zenhrResponse.json());
    }
    
    console.log('Data sync completed successfully!');
  } catch (error) {
    console.error('Error during data sync:', error);
  }
};

// Call the function to start the sync
fetchFromExternalAndSendToZenHR();`;
        
      case 'python':
        return `# Python - External System to ZenHR Integration
import requests
import json
import base64

def fetch_from_external_and_send_to_zenhr():
    try:
        # 1. Fetch data from external system
        external_url = '${externalUrl}'
        external_headers = {
${generateExternalAuthCode('python')}
            'Content-Type': 'application/json'
        }
        
        external_response = requests.${externalSystem.method.toLowerCase()}(external_url, headers=external_headers)
        external_response.raise_for_status()  # Raise exception for non-2xx status codes
        
        external_data = external_response.json()
        
        # 2. Process each record from external system
        records = external_data.get('data', [external_data]) if isinstance(external_data, dict) else [external_data]
        for data in records:
            # Map external fields to ZenHR fields
            mapped_data = {
${generateFieldMappingCode('python')}
            }
            
            # 3. Send mapped data to ZenHR
            zenhr_headers = {
                'key': 'YOUR_ZENHR_API_KEY',
                'Content-Type': 'application/json'
            }
            
            zenhr_response = requests.post(
                '${zenhrUrl}',
                headers=zenhr_headers,
                json=mapped_data
            )
            zenhr_response.raise_for_status()
            
            print(f"Successfully synced record to ZenHR: {zenhr_response.json()}")
        
        print("Data sync completed successfully!")
    except Exception as error:
        print(f"Error during data sync: {error}")

# Call the function to start the sync
if __name__ == "__main__":
    fetch_from_external_and_send_to_zenhr()`;
        
      case 'php':
        return `<?php
// PHP - External System to ZenHR Integration

/**
 * Function to fetch data from external system and send to ZenHR
 */
function fetchFromExternalAndSendToZenHR() {
    try {
        // 1. Fetch data from external system
        $externalUrl = '${externalUrl}';
        $externalHeaders = [
${generateExternalAuthCode('php')}
            'Content-Type: application/json'
        ];
        
        $externalCurl = curl_init();
        curl_setopt_array($externalCurl, [
            CURLOPT_URL => $externalUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $externalHeaders,
            CURLOPT_CUSTOMREQUEST => '${externalSystem.method}'
        ]);
        
        $externalResponse = curl_exec($externalCurl);
        $externalHttpCode = curl_getinfo($externalCurl, CURLINFO_HTTP_CODE);
        curl_close($externalCurl);
        
        if ($externalHttpCode < 200 || $externalHttpCode >= 300) {
            throw new Exception("External API responded with status: " . $externalHttpCode);
        }
        
        $externalData = json_decode($externalResponse, true);
        
        // 2. Process each record from external system
        $records = isset($externalData['data']) ? $externalData['data'] : [$externalData];
        foreach ($records as $data) {
            // Map external fields to ZenHR fields
            $mappedData = [
${generateFieldMappingCode('php')}
            ];
            
            // 3. Send mapped data to ZenHR
            $zenhrUrl = '${zenhrUrl}';
            $zenhrHeaders = [
                'key: YOUR_ZENHR_API_KEY',
                'Content-Type: application/json'
            ];
            
            $zenhrCurl = curl_init();
            curl_setopt_array($zenhrCurl, [
                CURLOPT_URL => $zenhrUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => $zenhrHeaders,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($mappedData)
            ]);
            
            $zenhrResponse = curl_exec($zenhrCurl);
            $zenhrHttpCode = curl_getinfo($zenhrCurl, CURLINFO_HTTP_CODE);
            curl_close($zenhrCurl);
            
            if ($zenhrHttpCode < 200 || $zenhrHttpCode >= 300) {
                throw new Exception("ZenHR API responded with status: " . $zenhrHttpCode);
            }
            
            echo "Successfully synced record to ZenHR: " . $zenhrResponse . "\n";
        }
        
        echo "Data sync completed successfully!\n";
    } catch (Exception $error) {
        echo "Error during data sync: " . $error->getMessage() . "\n";
    }
}

// Call the function to start the sync
fetchFromExternalAndSendToZenHR();
?>`;
        
      default:
        return 'Select a language to see code examples.';
    }
  };

  // Show correct code based on integration direction
  const getDisplayCode = () => {
    if (integrationDirection === 'zenhr_to_external' || activeTab === 'zenhr_to_external') {
      return generatedCode.zenhrToExternal;
    } else if (integrationDirection === 'external_to_zenhr' || activeTab === 'external_to_zenhr') {
      return generatedCode.externalToZenhr;
    } else {
      // For bidirectional, show based on active tab
      return activeTab === 'zenhr_to_external' ? generatedCode.zenhrToExternal : generatedCode.externalToZenhr;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Review & Generate Integration</h2>
        <p className="text-gray-600 mb-4">
          Review your configuration and generate the integration code to connect ZenHR with {externalSystem.name || 'your external system'}.
        </p>
      </div>

      {/* Configuration summary */}
      <div className="p-5 bg-zenhr-blue-lighter rounded-md space-y-4">
        <h3 className="text-lg font-semibold text-zenhr-blue">Integration Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Integration Direction</h4>
            <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
              <span className="font-medium">
                {integrationDirection === 'zenhr_to_external' 
                  ? 'ZenHR → External System' 
                  : integrationDirection === 'external_to_zenhr' 
                    ? 'External System → ZenHR' 
                    : 'Bidirectional'}
              </span>
              <span className="text-gray-500 text-xs block mt-1">
                {integrationDirection === 'zenhr_to_external' 
                  ? 'Data flows from ZenHR to your external system' 
                  : integrationDirection === 'external_to_zenhr' 
                    ? 'Data flows from your external system to ZenHR' 
                    : 'Data flows in both directions'}
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Field Mapping</h4>
            <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
              <span className="font-medium">{getMappedFieldsCount()} fields mapped</span>
              {getMappedFieldsCount() > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(mappedFields).slice(0, 3).map(([zenhrField, externalField]) => (
                    <span key={zenhrField} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                      {zenhrField} → {externalField}
                    </span>
                  ))}
                  {Object.keys(mappedFields).length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                      +{Object.keys(mappedFields).length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">ZenHR Endpoint</h4>
            <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
              <div className="flex items-center">
                <span className="font-medium">{getZenhrEndpointName()}</span>
                <span className={`badge ${selectedMethod === 'GET' ? 'badge-blue' : 'badge-orange'} ml-2`}>
                  {selectedMethod}
                </span>
              </div>
              <span className="text-gray-500 text-xs block mt-1">
                https://api.zenhr.com/api/v2/{selectedEndpoint}
              </span>
              <div className="mt-1">
                <span className="text-xs text-gray-600 mr-2">{selectedFields.length} fields</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="text-xs text-gray-600">{getActiveFiltersCount()} filters</span>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">External System</h4>
            <div className="bg-white px-3 py-2 rounded-md flex-1 text-sm">
              <div className="flex items-center">
                <span className="font-medium">{externalSystem.name || 'External System'}</span>
                <span className={`badge ${externalSystem.method === 'GET' ? 'badge-blue' : 'badge-orange'} ml-2`}>
                  {externalSystem.method}
                </span>
              </div>
              <span className="text-gray-500 text-xs block mt-1">
                {externalSystem.baseUrl}{externalSystem.endpoint}
              </span>
              <div className="mt-1">
                <span className="text-xs text-gray-600 mr-2">
                  Auth: {externalSystem.auth.type.replace('_', ' ').toUpperCase() || 'None'}
                </span>
                {externalSystemFields.length > 0 && (
                  <span className="text-xs text-gray-600">{externalSystemFields.length} fields</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration code */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zenhr-blue">Integration Code</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowApiKey(!showApiKey);
                setShowExternalAuth(!showExternalAuth);
              }}
              className="btn btn-sm btn-outline"
            >
              {showApiKey ? 'Hide Credentials' : 'Show Credentials'}
            </button>
            <button
              onClick={() => copyToClipboard(getDisplayCode())}
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
        
        {/* Direction tabs for bidirectional integration */}
        {integrationDirection === 'bidirectional' && (
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'zenhr_to_external' ? 'text-zenhr-blue border-b-2 border-zenhr-blue' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('zenhr_to_external')}
            >
              ZenHR → External
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'external_to_zenhr' ? 'text-zenhr-blue border-b-2 border-zenhr-blue' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('external_to_zenhr')}
            >
              External → ZenHR
            </button>
          </div>
        )}
        
        {/* Language selection */}
        <div className="flex mb-3 space-x-1">
          {['javascript', 'python', 'php'].map(lang => (
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
        
        {/* Code display */}
        <div className="code-block overflow-auto" style={{ maxHeight: '400px' }}>
          <pre className="text-sm whitespace-pre">
            {getDisplayCode()}
          </pre>
        </div>
      </div>

      {/* Raw API requests */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zenhr-blue">Raw API Requests</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="btn btn-sm btn-outline"
            >
              {showApiKey ? 'Hide API Key' : 'Show API Key'}
            </button>
          </div>
        </div>
        
        {/* ZenHR API Request */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">ZenHR API Request</h4>
          <div className="code-block overflow-auto" style={{ maxHeight: '200px' }}>
            <pre className="text-sm whitespace-pre">
              {formatDisplayRequest()}
            </pre>
          </div>
        </div>
        
        {/* External System API Request */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">External System API Request</h4>
          <div className="code-block overflow-auto" style={{ maxHeight: '200px' }}>
            <pre className="text-sm whitespace-pre">
{`${externalSystem.method} ${externalSystem.baseUrl}${externalSystem.endpoint}
Content-Type: application/json

// Authentication
${formatExternalAuth()}

// Sample Request Body
${JSON.stringify(
  Object.fromEntries(
    Object.entries(mappedFields).map(([zenhrField, externalField]) => [
      externalField, 
      `[${zenhrField} value]`
    ])
  ), 
  null, 2
)}
`}
            </pre>
          </div>
        </div>
      </div>

      {/* Documentation */}
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
              Proceed to the next step to test your integration, or refer to the 
              <a 
                href={`https://api-docs.zenhr.com/#${selectedEndpoint}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zenhr-blue font-medium mx-1 underline"
              >
                ZenHR API Documentation
              </a> 
              for more details.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              To implement this integration, copy the generated code and customize it for your specific needs.
              Make sure to replace the API keys and credentials with your actual production credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewGenerate;