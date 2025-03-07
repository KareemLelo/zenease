import React from 'react';
import { useIntegration } from '../contexts/IntegrationContext';
import EnhancedStepIndicator from './EnhancedStepIndicator';
import SaveConfigurationModal from './modals/SaveConfigurationModal';

// Import step components
import IntegrationDirection from './steps/IntegrationDirection';
import SelectEndpoint from './steps/SelectEndpoint';
import SelectFields from './steps/SelectFields';
import ConfigureFilters from './steps/ConfigureFilters';
import SetRequestDetails from './steps/SetRequestDetails';
import ReviewGenerate from './steps/ReviewGenerate';
import TestRequest from './steps/TestRequest';
import ExternalEndpointConfig from './steps/ExternalEndpointConfig';
import ExternalSystemFields from './steps/ExternalSystemFields';
import FieldMapping from './steps/FieldMapping';

const IntegrationConfigurator = () => {
  const { 
    currentStep, 
    handleBack, 
    handleNext,
    showSaveModal,
    setShowSaveModal,
    savedConfigurations,
    loadConfiguration,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedEndpoint,
    selectedMethod,
    integrationDirection
  } = useIntegration();

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <IntegrationDirection />;
      case 1:
        return <SelectEndpoint />;
      case 2:
        return <SelectFields />;
      case 3:
        return <ConfigureFilters />;
      case 4:
        return <SetRequestDetails />;
      case 5:
        return <ReviewGenerate />;
      case 6:
        return <TestRequest />;
      case 7:
        return <ExternalEndpointConfig />;
      case 8:
        return <ExternalSystemFields />;
      case 9:
        return <FieldMapping />;
      default:
        return <IntegrationDirection />;
    }
  };

  // Get steps based on integration direction for navigation logic
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

  // Filter saved configurations based on search term
  const filteredConfigurations = savedConfigurations.filter(config => 
    config.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 0 && !integrationDirection) {
      return true;
    }
    
    if (currentStep === 1 && !selectedEndpoint) {
      return true;
    }
    
    return false;
  };

  // Get the current steps sequence
  const steps = getSteps();
  
  // Find current step index in the sequence
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  // Check if we're on the last step
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="animate-fadeIn">
      {/* Tabs */}
      <div className="tabs mb-4">
        <div 
          className={`tab ${activeTab === 0 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          <div className="flex items-center">
            <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 1.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.5 9H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Integration
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 1 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <div className="flex items-center">
            <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.75 4.5H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.75 13.5H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Saved Integrations
            <span className="badge badge-blue ml-2">{savedConfigurations.length}</span>
          </div>
        </div>
      </div>

      {activeTab === 0 ? (
        <div className="card">
          {/* Step indicator */}
          <EnhancedStepIndicator />
          
          {/* Step content */}
          <div className="card-body">
            {renderStepContent()}
          </div>
          
          {/* Navigation buttons */}
          <div className="card-footer flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`btn btn-outline ${currentStepIndex === 0 ? 'btn-disabled' : ''}`}
            >
              <svg className="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6667 12.6667L5.33333 8.00004L10.6667 3.33337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            
            <div className="flex space-x-2">
              {currentStep === 5 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="btn btn-secondary"
                >
                  <svg className="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.6667L14 5.33333V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.3333 14V9.33337H4.66667V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.66667 2V5.33333H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save Integration
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`btn btn-primary ${isNextDisabled() ? 'btn-disabled' : ''}`}
              >
                {!isLastStep ? (
                  <>
                    Next
                    <svg className="ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.33333 3.33337L10.6667 8.00004L5.33333 12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                ) : (
                  <>
                    Finish
                    <svg className="ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-zenhr-blue m-0">Saved Integrations</h2>
            <p className="text-sm text-gray-600 m-0">Access your previously saved API configurations</p>
          </div>
          
          <div className="card-body">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14L11.3333 11.3333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            {/* List of saved configurations */}
            {filteredConfigurations.length > 0 ? (
              <div className="space-y-2">
                {filteredConfigurations.map(config => (
                  <div 
                    key={config.id} 
                    className="p-4 border border-gray-200 rounded-md hover:border-zenhr-blue transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-zenhr-blue">{config.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="badge badge-blue mr-2">{config.method}</span>
                          <span className="text-sm text-gray-600">{config.endpoint.replace(/_/g, ' ')}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {config.integrationDirection === 'zenhr_to_external' ? 'ZenHR → External' : 
                           config.integrationDirection === 'external_to_zenhr' ? 'External → ZenHR' : 
                           'Bidirectional'} • {config.fields.length} fields mapped
                        </p>
                      </div>
                      <button
                        onClick={() => loadConfiguration(config)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <svg className="mr-1" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.75 9.91667V11.6667C1.75 11.8877 1.83779 12.0996 1.99407 12.2559C2.15035 12.4122 2.36232 12.5 2.58333 12.5H11.4167C11.6377 12.5 11.8496 12.4122 12.0059 12.2559C12.1622 12.0996 12.25 11.8877 12.25 11.6667V9.91667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.5 6.41667L7 9.91667L10.5 6.41667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 9.91667V1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" rx="24" fill="#E9F1F7"/>
                  <path d="M24 16V32" stroke="#0B3954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 24H32" stroke="#0B3954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-700">No integrations found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm ? 
                    `No results matching "${searchTerm}". Try a different search term.` : 
                    'Start by creating a new integration configuration.'}
                </p>
                <button 
                  className="btn btn-primary mt-4"
                  onClick={() => setActiveTab(0)}
                >
                  Create New Integration
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Configuration Modal */}
      {showSaveModal && <SaveConfigurationModal />}
    </div>
  );
};

export default IntegrationConfigurator;