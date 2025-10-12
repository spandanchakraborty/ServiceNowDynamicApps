/**
 * Pre-built application templates for common use cases
 */

const ticketingTemplate = {
  appName: 'Custom Ticketing System',
  appScope: 'x_custom_ticket',
  description: 'A customizable ticketing system for tracking user requests',
  
  tables: [{
    name: 'ticket',
    label: 'Ticket',
    extends: 'task',
    fields: [
      {
        name: 'ticket_type',
        type: 'choice',
        label: 'Ticket Type',
        mandatory: true,
        choices: [
          { value: 'incident', label: 'Incident' },
          { value: 'request', label: 'Service Request' },
          { value: 'question', label: 'Question' }
        ]
      },
      {
        name: 'category',
        type: 'choice',
        label: 'Category',
        mandatory: true,
        choices: [
          { value: 'hardware', label: 'Hardware' },
          { value: 'software', label: 'Software' },
          { value: 'network', label: 'Network' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'impact',
        type: 'choice',
        label: 'Impact',
        mandatory: true,
        choices: [
          { value: '1', label: 'High' },
          { value: '2', label: 'Medium' },
          { value: '3', label: 'Low' }
        ]
      },
      {
        name: 'assigned_to',
        type: 'reference',
        label: 'Assigned To',
        reference: 'sys_user',
        mandatory: false
      },
      {
        name: 'resolution_notes',
        type: 'string',
        label: 'Resolution Notes',
        maxLength: 4000,
        mandatory: false
      }
    ]
  }],
  
  forms: [{
    table: 'x_custom_ticket_ticket',
    view: 'default',
    sections: [
      {
        name: 'Ticket Information',
        fields: ['number', 'ticket_type', 'category', 'short_description', 'description']
      },
      {
        name: 'Assignment',
        fields: ['assigned_to', 'assignment_group', 'state', 'priority', 'impact']
      },
      {
        name: 'Resolution',
        fields: ['resolution_notes', 'closed_at', 'closed_by']
      }
    ]
  }],
  
  businessRules: [{
    name: 'Set Priority Based on Impact',
    table: 'x_custom_ticket_ticket',
    when: 'before',
    operation: ['insert', 'update'],
    condition: 'impact.changes()',
    script: `
(function executeRule(current, previous) {
  if (current.impact == '1') {
    current.priority = 1;
  } else if (current.impact == '2') {
    current.priority = 3;
  } else {
    current.priority = 4;
  }
})(current, previous);
    `.trim()
  }],
  
  uiPolicies: [{
    name: 'Mandatory Resolution Notes on Closure',
    table: 'x_custom_ticket_ticket',
    onLoad: true,
    condition: 'state=6',
    actions: [{
      field: 'resolution_notes',
      mandatory: true,
      visible: true,
      readOnly: false
    }]
  }],
  
  roles: [{
    name: 'user',
    description: 'Basic ticket user role',
    elevatePrivilege: false
  }, {
    name: 'agent',
    description: 'Ticket agent role',
    elevatePrivilege: false
  }],
  
  menus: [{
    name: 'ticket_list',
    title: 'My Tickets',
    table: 'x_custom_ticket_ticket',
    type: 'list',
    roles: ['x_custom_ticket.user']
  }, {
    name: 'ticket_create',
    title: 'Create New Ticket',
    table: 'x_custom_ticket_ticket',
    type: 'form',
    roles: ['x_custom_ticket.user']
  }]
};

const assetManagementTemplate = {
  appName: 'Asset Management System',
  appScope: 'x_asset_mgmt',
  description: 'Track and manage organizational assets',
  
  tables: [{
    name: 'asset',
    label: 'Asset',
    extends: 'cmdb_ci',
    fields: [
      {
        name: 'asset_tag',
        type: 'string',
        label: 'Asset Tag',
        maxLength: 40,
        mandatory: true
      },
      {
        name: 'asset_type',
        type: 'choice',
        label: 'Asset Type',
        mandatory: true,
        choices: [
          { value: 'hardware', label: 'Hardware' },
          { value: 'software', label: 'Software' },
          { value: 'license', label: 'License' }
        ]
      },
      {
        name: 'purchase_date',
        type: 'date',
        label: 'Purchase Date',
        mandatory: false
      },
      {
        name: 'warranty_expiry',
        type: 'date',
        label: 'Warranty Expiry',
        mandatory: false
      },
      {
        name: 'assigned_to',
        type: 'reference',
        label: 'Assigned To',
        reference: 'sys_user',
        mandatory: false
      },
      {
        name: 'location',
        type: 'reference',
        label: 'Location',
        reference: 'cmn_location',
        mandatory: false
      }
    ]
  }],
  
  forms: [{
    table: 'x_asset_mgmt_asset',
    view: 'default',
    sections: [
      {
        name: 'Asset Details',
        fields: ['asset_tag', 'name', 'asset_type', 'model_number']
      },
      {
        name: 'Assignment',
        fields: ['assigned_to', 'location', 'department']
      },
      {
        name: 'Procurement',
        fields: ['purchase_date', 'warranty_expiry', 'cost']
      }
    ]
  }],
  
  roles: [{
    name: 'admin',
    description: 'Asset administrator',
    elevatePrivilege: false
  }],
  
  menus: [{
    name: 'asset_list',
    title: 'All Assets',
    table: 'x_asset_mgmt_asset',
    type: 'list',
    roles: ['x_asset_mgmt.admin']
  }]
};

const projectManagementTemplate = {
  appName: 'Project Management',
  appScope: 'x_project_mgmt',
  description: 'Manage projects and tasks',
  
  tables: [{
    name: 'project',
    label: 'Project',
    extends: 'task',
    fields: [
      {
        name: 'project_manager',
        type: 'reference',
        label: 'Project Manager',
        reference: 'sys_user',
        mandatory: true
      },
      {
        name: 'start_date',
        type: 'date',
        label: 'Start Date',
        mandatory: true
      },
      {
        name: 'end_date',
        type: 'date',
        label: 'End Date',
        mandatory: true
      },
      {
        name: 'budget',
        type: 'integer',
        label: 'Budget',
        mandatory: false
      },
      {
        name: 'status',
        type: 'choice',
        label: 'Status',
        mandatory: true,
        choices: [
          { value: 'planning', label: 'Planning' },
          { value: 'active', label: 'Active' },
          { value: 'on_hold', label: 'On Hold' },
          { value: 'completed', label: 'Completed' }
        ]
      }
    ]
  }],
  
  forms: [{
    table: 'x_project_mgmt_project',
    view: 'default',
    sections: [
      {
        name: 'Project Information',
        fields: ['number', 'short_description', 'description', 'status']
      },
      {
        name: 'Timeline',
        fields: ['start_date', 'end_date', 'percent_complete']
      },
      {
        name: 'Management',
        fields: ['project_manager', 'priority', 'budget']
      }
    ]
  }],
  
  roles: [{
    name: 'project_manager',
    description: 'Project manager role',
    elevatePrivilege: false
  }],
  
  menus: [{
    name: 'project_list',
    title: 'All Projects',
    table: 'x_project_mgmt_project',
    type: 'list',
    roles: ['x_project_mgmt.project_manager']
  }]
};

module.exports = {
  ticketing: ticketingTemplate,
  assetManagement: assetManagementTemplate,
  projectManagement: projectManagementTemplate
};
