// src/components/EnhancedStepIndicator.js
import React from 'react';
import { useIntegration } from '../contexts/IntegrationContext';

const EnhancedStepIndicator = () => {
  const { 
    currentStep,
    integrationDirection
  } = useIntegration();

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

  // Get steps for display
  const steps = getSteps();
  
  // Find current step index in sequence
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = ((currentStepIndex) / (steps.length - 1)) * 100;

  return (
    <div className="card-header p-6">
      <div className="steps">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`step ${
              currentStepIndex > index 
                ? 'step-complete' 
                : currentStepIndex === index 
                  ? 'step-active' 
                  : 'step-pending'
            }`}
          >
            <div className="step-circle">
              {currentStepIndex > index ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="step-label">
              {step.label}
            </div>
          </div>
        ))}
        
        {/* Progress bar */}
        <div className="step-progress">
          <div 
            className="step-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStepIndicator;