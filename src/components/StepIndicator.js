// src/components/StepIndicator.js
import React from 'react';

const StepIndicator = ({ currentStep }) => {
  // Define steps
  const steps = [
    { id: 1, label: 'Select Endpoint' },
    { id: 2, label: 'Choose Fields' },
    { id: 3, label: 'Set Filters' },
    { id: 4, label: 'Request Details' },
    { id: 5, label: 'Review & Generate' },
    { id: 6, label: 'Test Request' }
  ];

  // Calculate progress percentage for the progress bar
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="card-header p-6">
      <div className="steps">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`step ${
              currentStep > step.id 
                ? 'step-complete' 
                : currentStep === step.id 
                  ? 'step-active' 
                  : 'step-pending'
            }`}
          >
            <div className="step-circle">
              {currentStep > step.id ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                step.id
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

export default StepIndicator;