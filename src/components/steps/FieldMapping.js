// src/components/steps/FieldMapping.js
import React, { useState, useEffect } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const FieldMapping = () => {
  const {
    selectedEndpoint,
    selectedFields,
    integrationDirection,
    externalSystemFields,
    mappedFields,
    setMappedFields
  } = useIntegration();

  const [searchTerm, setSearchTerm] = useState('');
  const [unmappedOnly, setUnmappedOnly] = useState(false);

  // Get ZenHR fields based on selected endpoint and fields
  const zenhrFields = selectedFields.map(fieldId => {
    // This would come from your schema data
    return {
      id: fieldId,
      name: fieldId.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      // Would be populated from schema data
      type: 'string'
    };
  });

  // Filter fields based on search term
  const filteredZenhrFields = zenhrFields.filter(field => 
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExternalFields = externalSystemFields.filter(field => 
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update field mapping
  const updateFieldMapping = (zenhrFieldId, externalFieldId) => {
    setMappedFields({
      ...mappedFields,
      [zenhrFieldId]: externalFieldId
    });
  };

  // Get source and target fields based on integration direction
  const sourceFields = integrationDirection === 'external_to_zenhr' 
    ? filteredExternalFields 
    : filteredZenhrFields;
    
  const targetFields = integrationDirection === 'external_to_zenhr' 
    ? filteredZenhrFields 
    : filteredExternalFields;

  // Check if a field is mapped
  const isFieldMapped = (fieldId, isZenhrField) => {
    if (isZenhrField) {
      return mappedFields[fieldId] !== undefined;
    } else {
      return Object.values(mappedFields).includes(fieldId);
    }
  };

  // Get the mapped field name
  const getMappedFieldName = (fieldId, isZenhrField) => {
    if (isZenhrField) {
      const externalFieldId = mappedFields[fieldId];
      const externalField = externalSystemFields.find(f => f.id === externalFieldId);
      return externalField ? externalField.name : 'Not mapped';
    } else {
      const zenhrFieldId = Object.keys(mappedFields).find(key => mappedFields[key] === fieldId);
      const zenhrField = zenhrFields.find(f => f.id === zenhrFieldId);
      return zenhrField ? zenhrField.name : 'Not mapped';
    }
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
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">Map Fields</h2>
        <p className="text-gray-600 mb-4">
          {integrationDirection === 'zenhr_to_external'
            ? `Map ZenHR ${getFormattedEndpointName()} fields to your external system fields.`
            : `Map your external system fields to ZenHR ${getFormattedEndpointName()} fields.`}
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
        <div className="flex items-center">
          <input
            type="checkbox"
            id="unmappedOnly"
            checked={unmappedOnly}
            onChange={() => setUnmappedOnly(!unmappedOnly)}
            className="mr-2"
          />
          <label htmlFor="unmappedOnly" className="text-sm text-gray-700">
            Show unmapped fields only
          </label>
        </div>
      </div>

      {/* Field mapping table */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">
                {integrationDirection === 'zenhr_to_external' ? 'ZenHR Field' : 'External System Field'}
              </th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Mapping</th>
              <th className="p-3 text-left">
                {integrationDirection === 'zenhr_to_external' ? 'External System Field' : 'ZenHR Field'}
              </th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sourceFields
              .filter(field => !unmappedOnly || !isFieldMapped(field.id, integrationDirection === 'zenhr_to_external'))
              .map(sourceField => {
                const isZenhrSource = integrationDirection === 'zenhr_to_external';
                const isMapped = isFieldMapped(sourceField.id, isZenhrSource);
                
                return (
                  <tr 
                    key={sourceField.id}
                    className={`border-t border-gray-200 ${isMapped ? 'bg-zenhr-blue-lighter' : ''} hover:bg-gray-50`}
                  >
                    <td className="p-3">
                      <div className="font-medium">{sourceField.name}</div>
                      <div className="text-xs text-gray-500">{sourceField.id}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {sourceField.type}
                      </span>
                    </td>
                    <td className="p-3">
                      {isMapped ? (
                        <svg className="text-green-500 w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      ) : (
                        <svg className="text-gray-300 w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      )}
                    </td>
                    <td className="p-3">
                      {isMapped ? (
                        <div>
                          <div className="font-medium">{getMappedFieldName(sourceField.id, isZenhrSource)}</div>
                          <div className="text-xs text-gray-500">
                            {isZenhrSource ? mappedFields[sourceField.id] : Object.keys(mappedFields).find(key => mappedFields[key] === sourceField.id)}
                          </div>
                        </div>
                      ) : (
                        <select
                          className="select w-full"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              if (isZenhrSource) {
                                updateFieldMapping(sourceField.id, e.target.value);
                              } else {
                                const zenhrFieldId = targetFields.find(f => f.id === e.target.value)?.id;
                                if (zenhrFieldId) {
                                  updateFieldMapping(zenhrFieldId, sourceField.id);
                                }
                              }
                            }
                          }}
                        >
                          <option value="">Select a field to map</option>
                          {targetFields.map(targetField => (
                            <option 
                              key={targetField.id} 
                              value={targetField.id}
                              disabled={isZenhrSource 
                                ? Object.values(mappedFields).includes(targetField.id)
                                : isFieldMapped(targetField.id, true)
                              }
                            >
                              {targetField.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isMapped && (
                        <button
                          onClick={() => {
                            if (isZenhrSource) {
                              const newMappedFields = { ...mappedFields };
                              delete newMappedFields[sourceField.id];
                              setMappedFields(newMappedFields);
                            } else {
                              const zenhrFieldId = Object.keys(mappedFields).find(key => mappedFields[key] === sourceField.id);
                              if (zenhrFieldId) {
                                const newMappedFields = { ...mappedFields };
                                delete newMappedFields[zenhrFieldId];
                                setMappedFields(newMappedFields);
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {sourceFields.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No fields found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Mapping summary */}
      <div className="p-4 bg-zenhr-blue-lighter rounded-md">
        <h3 className="font-medium text-zenhr-blue mb-2">
          Mapping Summary
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Source Fields:</span>
            <span className="text-sm font-medium">{sourceFields.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Mapped Fields:</span>
            <span className="text-sm font-medium">{Object.keys(mappedFields).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Unmapped Fields:</span>
            <span className="text-sm font-medium">
              {integrationDirection === 'zenhr_to_external' 
                ? zenhrFields.length - Object.keys(mappedFields).length
                : externalSystemFields.length - Object.values(new Set(mappedFields)).length}
            </span>
          </div>
          {Object.keys(mappedFields).length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <button 
                className="btn btn-sm btn-outline text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => setMappedFields({})}
              >
                Clear All Mappings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Field transformation section (advanced) */}
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium text-zenhr-blue mb-2">
          Advanced Field Transformations
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Apply transformations to fields when data is transferred between systems.
        </p>
        
        {Object.keys(mappedFields).length > 0 ? (
          <div className="space-y-4">
            {Object.keys(mappedFields).map(zenhrFieldId => {
              const zenhrField = zenhrFields.find(f => f.id === zenhrFieldId);
              const externalFieldId = mappedFields[zenhrFieldId];
              const externalField = externalSystemFields.find(f => f.id === externalFieldId);
              
              if (!zenhrField || !externalField) return null;
              
              return (
                <div key={zenhrFieldId} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{zenhrField.name}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="font-medium">{externalField.name}</span>
                    </div>
                    <button className="btn btn-sm btn-outline">
                      Add Transformation
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    No transformations applied. Data will be transferred as is.
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              Map fields first to configure transformations.
            </p>
          </div>
        )}
      </div>

      {/* Help info */}
      <div className="alert alert-info">
        <div className="flex">
          <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66663V9.99996" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3334H10.0083" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Field Mapping Tips</h4>
            <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Map fields with similar data types for best results</li>
              <li>Required fields are marked with an asterisk (*)</li>
              <li>Use transformations for fields that need format conversion</li>
              <li>You can export your mapping configuration for reuse</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMapping;