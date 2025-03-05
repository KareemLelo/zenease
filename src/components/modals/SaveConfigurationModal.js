// src/components/modals/SaveConfigurationModal.js
import React from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const SaveConfigurationModal = () => {
  const {
    configName,
    setConfigName,
    saveConfiguration,
    setShowSaveModal,
    selectedEndpoint,
    selectedMethod,
    selectedFields,
    fieldValues,
    filterValues
  } = useIntegration();

  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfiguration();
  };

  const handleCancel = () => {
    setShowSaveModal(false);
  };

  // Format endpoint name for display
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get summary of configuration
  const getConfigurationSummary = () => {
    let summary = [];
    
    // Add API endpoint and method
    summary.push(`${selectedMethod} request to ${getFormattedEndpointName()}`);
    
    // Add fields count
    summary.push(`${selectedFields.length} fields selected`);
    
    // For GET requests, add filter count
    if (selectedMethod === 'GET') {
      const activeFilters = Object.entries(filterValues).filter(([_, value]) => value).length;
      if (activeFilters > 0) {
        summary.push(`${activeFilters} active filter${activeFilters !== 1 ? 's' : ''}`);
      }
    }
    
    // For POST requests, add required fields count
    if (selectedMethod === 'POST') {
      const filledValues = Object.entries(fieldValues).filter(([_, value]) => value).length;
      summary.push(`${filledValues} field value${filledValues !== 1 ? 's' : ''} specified`);
    }
    
    return summary.join(' • ');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-zenhr-blue m-0">Save Configuration</h3>
          <button
            onClick={handleCancel}
            className="btn-sm"
            style={{ background: 'none', border: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 5L15 15" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="label">Configuration Name</label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Enter a descriptive name"
                className="input"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a meaningful name that helps you identify this configuration later.
              </p>
            </div>
            
            <div className="p-4 bg-zenhr-blue-lighter rounded-md">
              <h4 className="font-medium text-zenhr-blue mb-2">Configuration Summary</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="badge badge-blue mr-2">{selectedMethod}</span>
                  <span className="font-medium">{getFormattedEndpointName()}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {getConfigurationSummary()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveConfigurationModal;