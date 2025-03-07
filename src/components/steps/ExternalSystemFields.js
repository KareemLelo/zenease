// src/components/steps/ExternalSystemFields.js
import React, { useState } from 'react';
import { useIntegration } from '../../contexts/IntegrationContext';

const ExternalSystemFields = () => {
  const {
    integrationDirection,
    externalSystem,
    externalSystemFields,
    setExternalSystemFields
  } = useIntegration();

  const [newField, setNewField] = useState({
    id: '',
    name: '',
    type: 'string',
    description: '',
    required: false
  });

  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  // Add or update field
  const saveField = () => {
    // Validate field
    if (!newField.id || !newField.name) {
      alert('Field ID and name are required');
      return;
    }

    // Check for duplicate ID (except when editing)
    if (editIndex === -1 && externalSystemFields.some(f => f.id === newField.id)) {
      alert('Field ID must be unique');
      return;
    }

    if (editIndex >= 0) {
      // Update existing field
      const updatedFields = [...externalSystemFields];
      updatedFields[editIndex] = {...newField};
      setExternalSystemFields(updatedFields);
      setEditIndex(-1);
    } else {
      // Add new field
      setExternalSystemFields([...externalSystemFields, {...newField}]);
    }

    // Reset form
    setNewField({
      id: '',
      name: '',
      type: 'string',
      description: '',
      required: false
    });
  };

  // Edit existing field
  const startEdit = (index) => {
    setNewField({...externalSystemFields[index]});
    setEditIndex(index);
  };

  // Cancel editing
  const cancelEdit = () => {
    setNewField({
      id: '',
      name: '',
      type: 'string',
      description: '',
      required: false
    });
    setEditIndex(-1);
  };

  // Delete field - Fix for ESLint no-restricted-globals error
  const deleteField = (index) => {
    // Using window.confirm instead of global confirm
    if (window.confirm('Are you sure you want to delete this field?')) {
      const updatedFields = externalSystemFields.filter((_, i) => i !== index);
      setExternalSystemFields(updatedFields);
      
      // If we're editing the field being deleted, reset the form
      if (editIndex === index) {
        cancelEdit();
      }
    }
  };

  // Filter fields based on search term
  const filteredFields = externalSystemFields.filter(field => 
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (field.description && field.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Import fields from JSON or CSV
  const importFields = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Try parsing as JSON
        const fields = JSON.parse(event.target.result);
        
        if (Array.isArray(fields)) {
          // Validate fields
          const validFields = fields.filter(field => 
            field.id && field.name && field.type
          );
          
          if (validFields.length > 0) {
            setExternalSystemFields([...externalSystemFields, ...validFields]);
            alert(`Successfully imported ${validFields.length} fields`);
          } else {
            alert('No valid fields found in the imported file');
          }
        } else {
          alert('Invalid format: The file must contain an array of field objects');
        }
      } catch (error) {
        // If JSON parsing fails, try CSV
        try {
          const lines = event.target.result.split('\n');
          const headers = lines[0].split(',');
          
          // Check if required headers exist
          const idIndex = headers.findIndex(h => h.trim().toLowerCase() === 'id');
          const nameIndex = headers.findIndex(h => h.trim().toLowerCase() === 'name');
          const typeIndex = headers.findIndex(h => h.trim().toLowerCase() === 'type');
          
          if (idIndex < 0 || nameIndex < 0) {
            alert('Invalid CSV format: The file must have "id" and "name" columns');
            return;
          }
          
          const validFields = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const field = {
              id: values[idIndex].trim(),
              name: values[nameIndex].trim(),
              type: typeIndex >= 0 ? values[typeIndex].trim() || 'string' : 'string',
              description: '',
              required: false
            };
            
            if (field.id && field.name) {
              validFields.push(field);
            }
          }
          
          if (validFields.length > 0) {
            setExternalSystemFields([...externalSystemFields, ...validFields]);
            alert(`Successfully imported ${validFields.length} fields`);
          } else {
            alert('No valid fields found in the imported file');
          }
        } catch (csvError) {
          alert('Failed to parse the file. Please ensure it is valid JSON or CSV.');
        }
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zenhr-blue mb-2">External System Fields</h2>
        <p className="text-gray-600 mb-4">
          {externalSystemFields.length > 0 
            ? `Define or modify the fields from ${externalSystem.name || 'the external system'}.`
            : `No fields have been defined yet for ${externalSystem.name || 'the external system'}. Add fields manually or import them from a file.`
          }
        </p>
      </div>

      {/* Field form */}
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold text-zenhr-blue mb-4">
          {editIndex >= 0 ? 'Edit Field' : 'Add New Field'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Field ID
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={newField.id}
              onChange={(e) => setNewField({...newField, id: e.target.value})}
              placeholder="e.g., employee_id, first_name"
              className="input"
              disabled={editIndex >= 0} // Don't allow changing ID when editing
              required
            />
            <p className="text-xs text-gray-500">Unique identifier for the field (no spaces)</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Field Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField({...newField, name: e.target.value})}
              placeholder="e.g., Employee ID, First Name"
              className="input"
              required
            />
            <p className="text-xs text-gray-500">Human-readable name</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Field Type</label>
            <select
              value={newField.type}
              onChange={(e) => setNewField({...newField, type: e.target.value})}
              className="select"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="datetime">Date & Time</option>
              <option value="array">Array</option>
              <option value="object">Object</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Required</label>
            <div className="pt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({...newField, required: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Field is required</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newField.description}
              onChange={(e) => setNewField({...newField, description: e.target.value})}
              placeholder="Describe what this field represents"
              className="input"
              rows={2}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          {editIndex >= 0 && (
            <button
              type="button"
              onClick={cancelEdit}
              className="btn btn-outline"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={saveField}
            className="btn btn-primary"
          >
            {editIndex >= 0 ? 'Update Field' : 'Add Field'}
          </button>
        </div>
      </div>

      {/* Field list */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-zenhr-blue">
            Defined Fields <span className="text-sm text-gray-500">({externalSystemFields.length})</span>
          </h3>
          
          <div className="flex space-x-2">
            <div className="relative">
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
            
            <label className="btn btn-outline">
              <span>Import</span>
              <input
                type="file"
                accept=".json,.csv"
                onChange={importFields}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {externalSystemFields.length > 0 ? (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Required</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFields.map((field, index) => (
                  <tr 
                    key={field.id}
                    className={`border-t border-gray-200 ${externalSystemFields.indexOf(field) === editIndex ? 'bg-zenhr-blue-lighter' : ''} hover:bg-gray-50`}
                  >
                    <td className="p-3 font-medium">{field.id}</td>
                    <td className="p-3">{field.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {field.type}
                      </span>
                    </td>
                    <td className="p-3">
                      {field.required ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-600 max-w-md truncate">{field.description || '-'}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => startEdit(externalSystemFields.indexOf(field))}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit field"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteField(externalSystemFields.indexOf(field))}
                          className="text-red-600 hover:text-red-800"
                          title="Delete field"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFields.length === 0 && (
              <div className="text-center py-6 bg-white">
                <p className="text-gray-500">No fields found matching your search criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-md border border-gray-200">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No Fields Defined</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              Define fields manually using the form above or import a JSON/CSV file with field definitions.
            </p>
          </div>
        )}
      </div>

      {/* Sample formats */}
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium text-zenhr-blue mb-2">
          Import Format Examples
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">JSON Format</h4>
            <pre className="text-xs p-3 bg-gray-100 rounded-md overflow-auto">
{`[
  {
    "id": "employee_id",
    "name": "Employee ID",
    "type": "string",
    "required": true,
    "description": "Unique employee identifier"
  },
  {
    "id": "first_name",
    "name": "First Name",
    "type": "string",
    "required": true
  }
]`}
            </pre>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">CSV Format</h4>
            <pre className="text-xs p-3 bg-gray-100 rounded-md overflow-auto">
{`id,name,type,required,description
employee_id,Employee ID,string,true,Unique employee identifier
first_name,First Name,string,true,
email,Email Address,string,false,Employee email address`}
            </pre>
          </div>
        </div>
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
            <h4 className="font-medium text-blue-700 mb-1">Field Definition Tips</h4>
            <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Field IDs should be unique and use snake_case (lowercase with underscores)</li>
              <li>Field names should be human-readable and descriptive</li>
              <li>Choose the appropriate field type to ensure correct data mapping</li>
              <li>Mark fields as required if they must have values</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalSystemFields;