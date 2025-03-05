// src/data/schemaData.js

// Available endpoints
export const endpoints = [
    { id: 'employees', name: 'Employees', description: 'Employee records and personal information' },
    { id: 'attendance', name: 'Attendance', description: 'Employee attendance records' },
    { id: 'payroll', name: 'Payroll', description: 'Payroll data for employees' },
    { id: 'professional_data', name: 'Professional Data', description: 'Professional qualifications and skills' },
    { id: 'leaves', name: 'Leaves', description: 'Leave requests and time off management' },
    { id: 'documents', name: 'Documents', description: 'Employee documents and files' },
    { id: 'departments', name: 'Departments', description: 'Company departments and structure' },
    { id: 'company_announcements', name: 'Company Announcements', description: 'Company-wide announcements and notifications' }
  ];
  
  // Fields for each endpoint
  const endpointFields = {
    employees: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the employee' },
      { id: 'first_name', name: 'First Name', type: 'string', category: 'Basic Info', description: 'Employee\'s first name' },
      { id: 'last_name', name: 'Last Name', type: 'string', category: 'Basic Info', description: 'Employee\'s last name' },
      { id: 'email', name: 'Email', type: 'string', category: 'Contact', description: 'Employee\'s email address' },
      { id: 'phone', name: 'Phone', type: 'string', category: 'Contact', description: 'Employee\'s phone number' },
      { id: 'hire_date', name: 'Hire Date', type: 'date', category: 'Employment', description: 'Date the employee was hired' },
      { id: 'department', name: 'Department', type: 'string', category: 'Employment', description: 'Employee\'s department' },
      { id: 'position', name: 'Position', type: 'string', category: 'Employment', description: 'Employee\'s job position' },
      { id: 'status', name: 'Status', type: 'string', category: 'Employment', description: 'Employment status (active, terminated, on leave)' },
      { id: 'manager_id', name: 'Manager ID', type: 'string', category: 'Employment', description: 'ID of employee\'s manager' },
      { id: 'salary', name: 'Salary', type: 'number', category: 'Financial', description: 'Employee\'s current salary' },
      { id: 'address', name: 'Address', type: 'string', category: 'Contact', description: 'Employee\'s address' },
      { id: 'city', name: 'City', type: 'string', category: 'Contact', description: 'Employee\'s city' },
      { id: 'country', name: 'Country', type: 'string', category: 'Contact', description: 'Employee\'s country' },
      { id: 'birth_date', name: 'Birth Date', type: 'date', category: 'Personal', description: 'Employee\'s date of birth' },
      { id: 'gender', name: 'Gender', type: 'string', category: 'Personal', description: 'Employee\'s gender' },
      { id: 'nationality', name: 'Nationality', type: 'string', category: 'Personal', description: 'Employee\'s nationality' },
      { id: 'emergency_contact', name: 'Emergency Contact', type: 'string', category: 'Contact', description: 'Emergency contact information' }
    ],
    attendance: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the attendance record' },
      { id: 'employee_id', name: 'Employee ID', type: 'string', category: 'Basic Info', description: 'ID of the employee' },
      { id: 'date', name: 'Date', type: 'date', category: 'Attendance', description: 'Date of the attendance record' },
      { id: 'check_in', name: 'Check In', type: 'datetime', category: 'Attendance', description: 'Check-in time' },
      { id: 'check_out', name: 'Check Out', type: 'datetime', category: 'Attendance', description: 'Check-out time' },
      { id: 'status', name: 'Status', type: 'string', category: 'Attendance', description: 'Attendance status (present, absent, late)' },
      { id: 'hours_worked', name: 'Hours Worked', type: 'number', category: 'Attendance', description: 'Total hours worked' },
      { id: 'overtime', name: 'Overtime', type: 'number', category: 'Attendance', description: 'Overtime hours' },
      { id: 'notes', name: 'Notes', type: 'string', category: 'Additional', description: 'Additional notes for this record' },
      { id: 'location', name: 'Location', type: 'string', category: 'Additional', description: 'Location of check-in/check-out' }
    ],
    payroll: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the payroll record' },
      { id: 'employee_id', name: 'Employee ID', type: 'string', category: 'Basic Info', description: 'ID of the employee' },
      { id: 'period_start', name: 'Period Start', type: 'date', category: 'Period', description: 'Start date of pay period' },
      { id: 'period_end', name: 'Period End', type: 'date', category: 'Period', description: 'End date of pay period' },
      { id: 'basic_salary', name: 'Basic Salary', type: 'number', category: 'Financial', description: 'Basic salary amount' },
      { id: 'overtime', name: 'Overtime', type: 'number', category: 'Financial', description: 'Overtime payment' },
      { id: 'bonus', name: 'Bonus', type: 'number', category: 'Financial', description: 'Bonus amount' },
      { id: 'deductions', name: 'Deductions', type: 'number', category: 'Financial', description: 'Total deductions' },
      { id: 'tax', name: 'Tax', type: 'number', category: 'Financial', description: 'Tax amount' },
      { id: 'net_pay', name: 'Net Pay', type: 'number', category: 'Financial', description: 'Net pay amount' },
      { id: 'payment_date', name: 'Payment Date', type: 'date', category: 'Financial', description: 'Date payment was processed' },
      { id: 'payment_method', name: 'Payment Method', type: 'string', category: 'Financial', description: 'Method of payment' },
      { id: 'currency', name: 'Currency', type: 'string', category: 'Financial', description: 'Payment currency' }
    ],
    leaves: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the leave request' },
      { id: 'employee_id', name: 'Employee ID', type: 'string', category: 'Basic Info', description: 'ID of the employee' },
      { id: 'start_date', name: 'Start Date', type: 'date', category: 'Leave', description: 'Start date of leave' },
      { id: 'end_date', name: 'End Date', type: 'date', category: 'Leave', description: 'End date of leave' },
      { id: 'leave_type', name: 'Leave Type', type: 'string', category: 'Leave', description: 'Type of leave (annual, sick, etc.)' },
      { id: 'status', name: 'Status', type: 'string', category: 'Leave', description: 'Status of leave request (pending, approved, rejected)' },
      { id: 'reason', name: 'Reason', type: 'string', category: 'Leave', description: 'Reason for leave request' },
      { id: 'approved_by', name: 'Approved By', type: 'string', category: 'Leave', description: 'ID of the manager who approved the request' },
      { id: 'days_count', name: 'Days Count', type: 'number', category: 'Leave', description: 'Number of leave days' }
    ],
    documents: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the document' },
      { id: 'employee_id', name: 'Employee ID', type: 'string', category: 'Basic Info', description: 'ID of the employee' },
      { id: 'title', name: 'Title', type: 'string', category: 'Document', description: 'Document title' },
      { id: 'type', name: 'Type', type: 'string', category: 'Document', description: 'Document type (contract, ID, etc.)' },
      { id: 'upload_date', name: 'Upload Date', type: 'date', category: 'Document', description: 'Date the document was uploaded' },
      { id: 'expiry_date', name: 'Expiry Date', type: 'date', category: 'Document', description: 'Expiration date of the document' },
      { id: 'file_name', name: 'File Name', type: 'string', category: 'Document', description: 'Name of the document file' },
      { id: 'file_size', name: 'File Size', type: 'number', category: 'Document', description: 'Size of the document file in bytes' },
      { id: 'file_type', name: 'File Type', type: 'string', category: 'Document', description: 'Type of file (PDF, DOCX, etc.)' }
    ],
    professional_data: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier' },
      { id: 'employee_id', name: 'Employee ID', type: 'string', category: 'Basic Info', description: 'Associated employee ID' },
      { id: 'education', name: 'Education', type: 'string', category: 'Education', description: 'Education details' },
      { id: 'degree', name: 'Degree', type: 'string', category: 'Education', description: 'Highest degree achieved' },
      { id: 'institution', name: 'Institution', type: 'string', category: 'Education', description: 'Educational institution' },
      { id: 'graduation_year', name: 'Graduation Year', type: 'number', category: 'Education', description: 'Year of graduation' },
      { id: 'skills', name: 'Skills', type: 'array', category: 'Skills', description: 'List of skills' },
      { id: 'certifications', name: 'Certifications', type: 'array', category: 'Skills', description: 'Professional certifications' },
      { id: 'languages', name: 'Languages', type: 'array', category: 'Skills', description: 'Languages spoken' },
      { id: 'previous_experience', name: 'Previous Experience', type: 'string', category: 'Experience', description: 'Previous work experience' }
    ],
    departments: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the department' },
      { id: 'name', name: 'Name', type: 'string', category: 'Basic Info', description: 'Department name' },
      { id: 'code', name: 'Code', type: 'string', category: 'Basic Info', description: 'Department code' },
      { id: 'manager_id', name: 'Manager ID', type: 'string', category: 'Management', description: 'ID of department manager' },
      { id: 'parent_id', name: 'Parent Department ID', type: 'string', category: 'Structure', description: 'ID of parent department' },
      { id: 'description', name: 'Description', type: 'string', category: 'Details', description: 'Department description' },
      { id: 'location', name: 'Location', type: 'string', category: 'Details', description: 'Department location' },
      { id: 'created_at', name: 'Created At', type: 'datetime', category: 'System', description: 'Creation timestamp' },
      { id: 'updated_at', name: 'Updated At', type: 'datetime', category: 'System', description: 'Last update timestamp' }
    ],
    company_announcements: [
      { id: 'id', name: 'ID', type: 'string', category: 'Basic Info', description: 'Unique identifier for the announcement' },
      { id: 'title', name: 'Title', type: 'string', category: 'Content', description: 'Announcement title' },
      { id: 'content', name: 'Content', type: 'string', category: 'Content', description: 'Announcement content' },
      { id: 'author_id', name: 'Author ID', type: 'string', category: 'Basic Info', description: 'ID of the author' },
      { id: 'publish_date', name: 'Publish Date', type: 'date', category: 'Publication', description: 'Date of publication' },
      { id: 'expiry_date', name: 'Expiry Date', type: 'date', category: 'Publication', description: 'Expiration date' },
      { id: 'priority', name: 'Priority', type: 'string', category: 'Publication', description: 'Announcement priority (low, medium, high)' },
      { id: 'target_departments', name: 'Target Departments', type: 'array', category: 'Audience', description: 'Departments targeted by the announcement' },
      { id: 'attachment_url', name: 'Attachment URL', type: 'string', category: 'Content', description: 'URL to attached file' }
    ]
  };
  
  // Define filters for each endpoint
  const endpointFilters = {
    employees: [
      { id: 'department', name: 'Department', type: 'string', description: 'Filter by department name' },
      { id: 'status', name: 'Status', type: 'string', description: 'Filter by employment status' },
      { id: 'hire_date_from', name: 'Hire Date From', type: 'date', description: 'Filter by hire date (from)' },
      { id: 'hire_date_to', name: 'Hire Date To', type: 'date', description: 'Filter by hire date (to)' },
      { id: 'manager_id', name: 'Manager ID', type: 'string', description: 'Filter by manager ID' },
      { id: 'position', name: 'Position', type: 'string', description: 'Filter by job position' }
    ],
    attendance: [
      { id: 'employee_id', name: 'Employee ID', type: 'string', description: 'Filter by employee ID' },
      { id: 'date_from', name: 'Date From', type: 'date', description: 'Filter by date range (from)' },
      { id: 'date_to', name: 'Date To', type: 'date', description: 'Filter by date range (to)' },
      { id: 'status', name: 'Status', type: 'string', description: 'Filter by attendance status' }
    ],
    payroll: [
      { id: 'employee_id', name: 'Employee ID', type: 'string', description: 'Filter by employee ID' },
      { id: 'period_start', name: 'Period Start', type: 'date', description: 'Filter by period start date' },
      { id: 'period_end', name: 'Period End', type: 'date', description: 'Filter by period end date' },
      { id: 'payment_date_from', name: 'Payment Date From', type: 'date', description: 'Filter by payment date (from)' },
      { id: 'payment_date_to', name: 'Payment Date To', type: 'date', description: 'Filter by payment date (to)' }
    ],
    leaves: [
      { id: 'employee_id', name: 'Employee ID', type: 'string', description: 'Filter by employee ID' },
      { id: 'start_date_from', name: 'Start Date From', type: 'date', description: 'Filter by start date (from)' },
      { id: 'start_date_to', name: 'Start Date To', type: 'date', description: 'Filter by start date (to)' },
      { id: 'status', name: 'Status', type: 'string', description: 'Filter by request status' },
      { id: 'leave_type', name: 'Leave Type', type: 'string', description: 'Filter by leave type' }
    ],
    documents: [
      { id: 'employee_id', name: 'Employee ID', type: 'string', description: 'Filter by employee ID' },
      { id: 'type', name: 'Document Type', type: 'string', description: 'Filter by document type' },
      { id: 'upload_date_from', name: 'Upload Date From', type: 'date', description: 'Filter by upload date (from)' },
      { id: 'upload_date_to', name: 'Upload Date To', type: 'date', description: 'Filter by upload date (to)' },
      { id: 'expiry_date_from', name: 'Expiry Date From', type: 'date', description: 'Filter by expiry date (from)' },
      { id: 'expiry_date_to', name: 'Expiry Date To', type: 'date', description: 'Filter by expiry date (to)' }
    ],
    professional_data: [
      { id: 'employee_id', name: 'Employee ID', type: 'string', description: 'Filter by employee ID' },
      { id: 'degree', name: 'Degree', type: 'string', description: 'Filter by degree' },
      { id: 'graduation_year_from', name: 'Graduation Year From', type: 'number', description: 'Filter by graduation year (from)' },
      { id: 'graduation_year_to', name: 'Graduation Year To', type: 'number', description: 'Filter by graduation year (to)' },
      { id: 'skill', name: 'Skill', type: 'string', description: 'Filter by skill' }
    ],
    departments: [
      { id: 'name', name: 'Department Name', type: 'string', description: 'Filter by department name' },
      { id: 'code', name: 'Department Code', type: 'string', description: 'Filter by department code' },
      { id: 'manager_id', name: 'Manager ID', type: 'string', description: 'Filter by manager ID' },
      { id: 'parent_id', name: 'Parent Department ID', type: 'string', description: 'Filter by parent department ID' },
      { id: 'location', name: 'Location', type: 'string', description: 'Filter by location' }
    ],
    company_announcements: [
      { id: 'author_id', name: 'Author ID', type: 'string', description: 'Filter by author ID' },
      { id: 'publish_date_from', name: 'Publish Date From', type: 'date', description: 'Filter by publish date (from)' },
      { id: 'publish_date_to', name: 'Publish Date To', type: 'date', description: 'Filter by publish date (to)' },
      { id: 'priority', name: 'Priority', type: 'string', description: 'Filter by priority level' },
      { id: 'target_department', name: 'Target Department', type: 'string', description: 'Filter by target department' }
    ]
  };
  
  // Required fields for POST requests
  const requiredFieldsByEndpoint = {
    employees: ['first_name', 'last_name', 'email', 'hire_date'],
    attendance: ['employee_id', 'date', 'check_in'],
    payroll: ['employee_id', 'period_start', 'period_end', 'basic_salary'],
    leaves: ['employee_id', 'start_date', 'end_date', 'leave_type'],
    documents: ['employee_id', 'title', 'type'],
    professional_data: ['employee_id', 'education'],
    departments: ['name', 'code'],
    company_announcements: ['title', 'content', 'publish_date']
  };
  
  // Optional fields for POST requests
  const optionalFieldsByEndpoint = {
    employees: ['department', 'position', 'status', 'manager_id', 'salary', 'phone', 'address', 'city', 'country', 'birth_date', 'gender', 'nationality', 'emergency_contact'],
    attendance: ['check_out', 'status', 'notes', 'hours_worked', 'overtime', 'location'],
    payroll: ['overtime', 'bonus', 'deductions', 'tax', 'payment_date', 'payment_method', 'currency'],
    leaves: ['reason', 'status', 'days_count'],
    documents: ['upload_date', 'expiry_date', 'file_name', 'file_size', 'file_type'],
    professional_data: ['degree', 'institution', 'graduation_year', 'skills', 'certifications', 'languages', 'previous_experience'],
    departments: ['manager_id', 'parent_id', 'description', 'location'],
    company_announcements: ['expiry_date', 'priority', 'target_departments', 'attachment_url', 'author_id']
  };
  
  // Getter functions
  export const getEndpoints = () => endpoints;
  
  export const getEndpointFields = (endpointId) => {
    return endpointFields[endpointId] || [];
  };
  
  export const getEndpointFilters = (endpointId) => {
    return endpointFilters[endpointId] || [];
  };
  
  export const getRequiredFields = (endpointId) => {
    return requiredFieldsByEndpoint[endpointId] || [];
  };
  
  export const getOptionalFields = (endpointId) => {
    return optionalFieldsByEndpoint[endpointId] || [];
  };