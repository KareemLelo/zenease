// src/components/steps/SelectFields.js
import React, { useState } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const SelectFields = () => {
  const {
    availableFields,
    selectedFields,
    toggleFieldSelection,
    selectAllFields,
    deselectAllFields,
    selectedMethod,
    selectedEndpoint,
    requiredFields
  } = useIntegration();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Get unique categories from available fields
  const categories = ['all', ...new Set(availableFields.map(field => field.category))];

  // Filter fields by search term and category
  const filteredFields = availableFields.filter(field => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      field.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (field.description && field.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group fields by category
  const groupedFields = filteredFields.reduce((acc, field) => {
    const category = field.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {});

  // For POST method, show which fields are required
  const isFieldRequired = (fieldId) => {
    return selectedMethod === 'POST' && requiredFields.includes(fieldId);
  };

  // Get formatted endpoint name
  const getFormattedEndpointName = () => {
    return selectedEndpoint
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Select Fields</h2>
        <p className="text-gray-600">
          {selectedMethod === 'GET'
            ? `Choose which fields you want to retrieve from the ${getFormattedEndpointName()} endpoint.`
            : `Select optional fields to include in your ${getFormattedEndpointName()} request. Required fields are automatically selected.`}
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.3333 11.3333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fields..."
            className="input pl-10"
          />
        </div>
        <div className="sm:w-auto w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select w-full sm:w-auto"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke={viewMode === 'grid' ? '#0B3954' : '#6B7280'} strokeWidth="1.5"/>
              <rect x="9" y="2" width="5" height="5" rx="1" stroke={viewMode === 'grid' ? '#0B3954' : '#6B7280'} strokeWidth="1.5"/>
              <rect x="2" y="9" width="5" height="5" rx="1" stroke={viewMode === 'grid' ? '#0B3954' : '#6B7280'} strokeWidth="1.5"/>
              <rect x="9" y="9" width="5" height="5" rx="1" stroke={viewMode === 'grid' ? '#0B3954' : '#6B7280'} strokeWidth="1.5"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="12" height="2" rx="1" fill={viewMode === 'list' ? '#0B3954' : '#6B7280'}/>
              <rect x="2" y="7" width="12" height="2" rx="1" fill={viewMode === 'list' ? '#0B3954' : '#6B7280'}/>
              <rect x="2" y="11" width="12" height="2" rx="1" fill={viewMode === 'list' ? '#0B3954' : '#6B7280'}/>
            </svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-600">
            {selectedFields.length} of {availableFields.length} fields selected
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={selectAllFields}
            className="btn btn-sm btn-outline-primary"
          >
            Select All
          </button>
          <button
            onClick={deselectAllFields}
            className="btn btn-sm btn-outline"
            disabled={selectedFields.length === 0}
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Fields display */}
      {viewMode === 'grid' ? (
        // Grid view
        <div className="space-y-6">
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category}>
              <h3 className="text-md font-semibold text-zenhr-blue mb-3 flex items-center">
                {category}
                <span className="badge badge-blue ml-2">{fields.length}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {fields.map(field => {
                  const isRequired = isFieldRequired(field.id);
                  const isSelected = selectedFields.includes(field.id);
                  
                  return (
                    <div
                      key={field.id}
                      className={`checkbox-container ${isSelected || isRequired ? 'selected' : ''}`}
                      onClick={() => !isRequired && toggleFieldSelection(field.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected || isRequired}
                        onChange={() => {}}
                        disabled={isRequired}
                        className="checkbox-input"
                      />
                      <div className="checkbox-content">
                        <div className="flex items-center flex-wrap">
                          <label className="checkbox-label">{field.name}</label>
                          {isRequired && (
                            <span className="badge badge-orange ml-1 text-xs">Required</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Field ID: {field.id}
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            Type: {field.type}
                          </span>
                          {field.category && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {field.category}
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <div className="text-xs text-gray-600">
                            {field.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div className="space-y-2 border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">
                  <input 
                    type="checkbox"
                    checked={selectedFields.length === filteredFields.length}
                    onChange={selectedFields.length === filteredFields.length ? deselectAllFields : selectAllFields}
                    className="mr-2"
                  />
                  Field Name
                </th>
                <th className="p-3 text-left">Field ID</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map(field => {
                const isRequired = isFieldRequired(field.id);
                const isSelected = selectedFields.includes(field.id);
                
                return (
                  <tr 
                    key={field.id}
                    className={`border-t border-gray-200 ${isSelected || isRequired ? 'bg-zenhr-blue-lighter' : ''} hover:bg-gray-50`}
                    onClick={() => !isRequired && toggleFieldSelection(field.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected || isRequired}
                          onChange={() => {}}
                          disabled={isRequired}
                          className="mr-2"
                        />
                        <div>
                          <div className="font-medium">{field.name}</div>
                          {isRequired && (
                            <span className="badge badge-orange text-xs">Required</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{field.id}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {field.type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{field.category || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredFields.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No fields found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Selected fields summary */}
      <div className="p-4 bg-zenhr-blue-lighter rounded-md">
        <h3 className="font-medium text-zenhr-blue mb-2">
          Selected Fields ({selectedFields.length})
        </h3>
        <div>
          {selectedFields.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedFields.map(fieldId => {
                const field = availableFields.find(f => f.id === fieldId);
                return (
                  <span 
                    key={fieldId}
                    className="px-2 py-1 bg-white rounded-md border border-zenhr-blue text-zenhr-blue text-sm flex items-center"
                  >
                    {field ? field.name : fieldId}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFieldSelection(fieldId);
                      }}
                      className="ml-1 focus:outline-none"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 3.5L3.5 10.5" stroke="#0B3954" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 3.5L10.5 10.5" stroke="#0B3954" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No fields selected</p>
          )}
        </div>
      </div>

      {/* Help message */}
      <div className="alert alert-info">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-sm">
              {selectedMethod === 'GET' 
                ? "For GET requests, selecting specific fields helps reduce response size and improve performance."
                : "For POST requests, required fields must be included. Optional fields will only be sent if selected."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectFields;