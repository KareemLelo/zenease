// src/App.js
import React from 'react';
import IntegrationConfigurator from './components/IntegrationConfigurator';
import { IntegrationProvider } from './contexts/IntegrationContext';
import './style.css';

const App = () => {
  return (
    <div className="bg-gray-50">
      <header className="header">
        <div className="container flex items-center">
          <div className="mr-2">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" fill="#0B3954" />
              <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24C36 30.6 30.6 36 24 36Z" fill="#FFB30F"/>
              <path d="M24 16C19.6 16 16 19.6 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 19.6 28.4 16 24 16ZM24 28C21.8 28 20 26.2 20 24C20 21.8 21.8 20 24 20C26.2 20 28 21.8 28 24C28 26.2 26.2 28 24 28Z" fill="#FFB30F"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold m-0">ZenHR Integration Configurator</h1>
            <p className="text-sm m-0">Connect ZenHR APIs with any third-party system</p>
          </div>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          <div className="flex items-center mb-6">
            <div className="mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9 6.6C12.7 6.5 12.5 6.5 12.3 6.6L4.3 9.3C4.1 9.4 4 9.6 4 9.8C4 10 4.1 10.2 4.3 10.3L12.3 13.7C12.4 13.7 12.5 13.8 12.6 13.8C12.7 13.8 12.8 13.8 12.9 13.7L20.9 10.3C21.1 10.2 21.2 10 21.2 9.8C21.2 9.6 21.1 9.4 20.9 9.3L12.9 6.6Z" fill="#0B3954"/>
                <path d="M12.9 16.4C12.8 16.4 12.7 16.4 12.6 16.4L4.6 13V17.5C4.6 18 4.9 18.4 5.3 18.6L12.3 21.4C12.4 21.4 12.5 21.4 12.6 21.4C12.7 21.4 12.8 21.4 12.9 21.4L19.9 18.6C20.3 18.4 20.6 18 20.6 17.5V13L12.9 16.4Z" fill="#0B3954"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zenhr-blue m-0">API Integration Wizard</h2>
              <p className="text-sm text-gray-600 m-0">Configure your ZenHR API integration in minutes</p>
            </div>
          </div>
          
          <IntegrationProvider>
            <IntegrationConfigurator />
          </IntegrationProvider>
          
          <div className="mt-4 alert alert-info">
            <div className="flex items-center">
              <svg className="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Need help? Visit the <a href="https://api-docs.zenhr.com/" className="text-zenhr-blue font-medium" target="_blank" rel="noopener noreferrer">ZenHR API Documentation</a> for more information.</span>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" fill="#0B3954" />
                  <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24C36 30.6 30.6 36 24 36Z" fill="#FFB30F"/>
                  <path d="M24 16C19.6 16 16 19.6 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 19.6 28.4 16 24 16ZM24 28C21.8 28 20 26.2 20 24C20 21.8 21.8 20 24 20C26.2 20 28 21.8 28 24C28 26.2 26.2 28 24 28Z" fill="#FFB30F"/>
                </svg>
                <span className="ml-2 font-bold">ZenHR</span>
              </div>
              <p className="text-sm mt-2">Simplifying HR for growing companies</p>
            </div>
            
            <div className="text-sm">
              <p>© {new Date().getFullYear()} ZenHR. All rights reserved.</p>
              <p className="mt-1">The #1 HR solution in the MENA region</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;