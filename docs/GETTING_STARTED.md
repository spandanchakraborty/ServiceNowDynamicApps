# Getting Started Guide

## Overview

This guide will help you quickly get started with the ServiceNow Dynamic Apps Generator. You'll learn how to generate your first ServiceNow application in minutes.

## Prerequisites

- Node.js (v14 or higher)
- ServiceNow instance (Developer instance recommended for testing)
- Basic understanding of ServiceNow concepts (tables, forms, business rules)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/spandanchakraborty/ServiceNowDynamicApps.git
   cd ServiceNowDynamicApps
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   node cli.js help
   ```

## Quick Start - Using Templates

### Step 1: List Available Templates

```bash
node cli.js list-templates
```

This will show you all pre-built templates:
- `ticketing` - Ticketing/Help Desk system
- `assetManagement` - Asset tracking system
- `projectManagement` - Project management system

### Step 2: Generate a Sample Configuration

```bash
node cli.js sample ticketing "My Help Desk"
```

This creates a configuration file: `x_my_help_desk_config.json`

### Step 3: Review and Customize

Open the generated file and customize as needed:
```json
{
  "appName": "My Help Desk",
  "appScope": "x_my_help_desk",
  "description": "...",
  "tables": [...],
  "forms": [...],
  ...
}
```

### Step 4: Validate Configuration

```bash
node cli.js validate x_my_help_desk_config.json
```

### Step 5: Generate the App

Set environment variables:
```bash
export INSTANCE_URL="https://dev12345.service-now.com"
export SN_USER="admin"
export SN_PASS="your_password"
```

Generate the app:
```bash
node cli.js generate x_my_help_desk_config.json
```

## Creating a Custom App

### Method 1: Start from Scratch

Create a configuration file `my-app-config.json`:

```json
{
  "appName": "My Custom App",
  "appScope": "x_my_custom_app",
  "description": "My custom ServiceNow application",
  
  "tables": [{
    "name": "custom_record",
    "label": "Custom Record",
    "extends": "task",
    "fields": [
      {
        "name": "custom_field",
        "type": "string",
        "label": "Custom Field",
        "maxLength": 100,
        "mandatory": true
      }
    ]
  }],
  
  "forms": [{
    "table": "x_my_custom_app_custom_record",
    "view": "default",
    "sections": [{
      "name": "Main Information",
      "fields": ["number", "custom_field", "short_description"]
    }]
  }],
  
  "roles": [{
    "name": "user",
    "description": "Basic user role"
  }],
  
  "menus": [{
    "name": "records_list",
    "title": "Custom Records",
    "table": "x_my_custom_app_custom_record",
    "type": "list",
    "roles": ["x_my_custom_app.user"]
  }]
}
```

### Method 2: Modify a Template

```javascript
const DynamicAppFactory = require('./src/index');

// Get a template
const template = DynamicAppFactory.getTemplate('ticketing');

// Modify it
template.appName = 'My Custom Ticketing';
template.appScope = 'x_my_custom_ticket';

// Add a custom field
template.tables[0].fields.push({
  name: 'custom_category',
  type: 'choice',
  label: 'Custom Category',
  mandatory: false,
  choices: [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' }
  ]
});

// Generate
const result = await DynamicAppFactory.generateApp(
  template,
  instanceUrl,
  username,
  password
);

console.log(result);
```

## Programmatic Usage

### Basic Example

```javascript
const DynamicAppFactory = require('./src/index');

async function generateMyApp() {
  const config = {
    appName: 'IT Support',
    appScope: 'x_it_support',
    description: 'IT Support application',
    
    tables: [{
      name: 'support_ticket',
      label: 'Support Ticket',
      extends: 'task',
      fields: [
        {
          name: 'requester_email',
          type: 'email',
          label: 'Requester Email',
          mandatory: true
        },
        {
          name: 'issue_type',
          type: 'choice',
          label: 'Issue Type',
          mandatory: true,
          choices: [
            { value: 'hardware', label: 'Hardware Issue' },
            { value: 'software', label: 'Software Issue' },
            { value: 'network', label: 'Network Issue' }
          ]
        }
      ]
    }],
    
    forms: [{
      table: 'x_it_support_support_ticket',
      view: 'default',
      sections: [{
        name: 'Ticket Details',
        fields: ['number', 'requester_email', 'issue_type', 'short_description']
      }]
    }],
    
    businessRules: [{
      name: 'Set Default Priority',
      table: 'x_it_support_support_ticket',
      when: 'before',
      operation: ['insert'],
      condition: '',
      script: `
        (function executeRule(current, previous) {
          if (!current.priority) {
            current.priority = 3; // Medium priority
          }
        })(current, previous);
      `
    }],
    
    roles: [{
      name: 'agent',
      description: 'Support agent role'
    }],
    
    menus: [{
      name: 'my_tickets',
      title: 'My Tickets',
      table: 'x_it_support_support_ticket',
      type: 'list',
      roles: ['x_it_support.agent']
    }]
  };

  const result = await DynamicAppFactory.generateApp(
    config,
    'https://dev12345.service-now.com',
    'admin',
    'password'
  );

  if (result.success) {
    console.log('App generated successfully!');
    console.log('Scope:', result.appScope);
  } else {
    console.error('Generation failed:', result.error);
  }
}

generateMyApp();
```

## Field Types Reference

| Type | Description | Additional Properties |
|------|-------------|----------------------|
| `string` | Text field | `maxLength` |
| `integer` | Number field | - |
| `boolean` | True/False field | - |
| `reference` | Lookup to another table | `reference` (table name) |
| `date` | Date field | - |
| `datetime` | Date and time field | - |
| `choice` | Dropdown with predefined options | `choices` (array) |
| `email` | Email field with validation | - |
| `url` | URL field with validation | - |

## Common Patterns

### 1. Approval Workflow

```json
{
  "workflows": [{
    "name": "Approval Workflow",
    "table": "x_my_app_table",
    "description": "Request approval workflow",
    "activities": [
      {
        "type": "approval",
        "name": "Manager Approval",
        "config": {
          "approver": "manager",
          "timeout": "48 hours"
        }
      },
      {
        "type": "notification",
        "name": "Approval Complete",
        "config": {
          "recipients": "requester",
          "template": "approval_complete"
        }
      }
    ]
  }]
}
```

### 2. Conditional Field Display

```json
{
  "uiPolicies": [{
    "name": "Show Resolution on Resolved",
    "table": "x_my_app_table",
    "onLoad": true,
    "condition": "state=resolved",
    "actions": [{
      "field": "resolution_notes",
      "mandatory": true,
      "visible": true,
      "readOnly": false
    }]
  }]
}
```

### 3. Auto-populate Fields

```json
{
  "businessRules": [{
    "name": "Auto-populate Assignment",
    "table": "x_my_app_table",
    "when": "before",
    "operation": ["insert"],
    "condition": "",
    "script": `
      (function executeRule(current, previous) {
        if (current.category == 'hardware') {
          current.assignment_group = 'Hardware Support';
        } else if (current.category == 'software') {
          current.assignment_group = 'Software Support';
        }
      })(current, previous);
    `
  }]
}
```

## Troubleshooting

### Common Issues

**Issue 1: Validation Fails**
- Check that `appScope` starts with `x_`
- Ensure all required fields are provided
- Verify field types match their properties (e.g., `reference` type needs `reference` property)

**Issue 2: Generation Fails**
- Verify ServiceNow credentials are correct
- Check network connectivity to ServiceNow instance
- Ensure you have proper permissions in ServiceNow

**Issue 3: Module Not Found**
- Run `npm install` to install dependencies
- Check that you're in the correct directory

## Next Steps

1. **Explore Templates**: Look at the pre-built templates in `src/templates/`
2. **Read Examples**: Check out `examples/usage-examples.js` for more patterns
3. **Review Architecture**: See `docs/ARCHITECTURE.md` for system design
4. **Customize**: Create your own templates for your organization's needs

## Best Practices

1. **Start Small**: Begin with a simple app and add features incrementally
2. **Use Templates**: Leverage existing templates as starting points
3. **Validate Often**: Always validate before generating
4. **Version Control**: Keep your configuration files in version control
5. **Test First**: Use a development instance before production
6. **Document**: Add clear descriptions to your configurations
7. **Scope Naming**: Use meaningful scope names (e.g., `x_hr_onboarding` vs `x_app1`)

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/spandanchakraborty/ServiceNowDynamicApps/issues)
- Documentation: See README.md and docs/ directory
- Examples: Check examples/ directory for working code

## Resources

- [ServiceNow Developer Documentation](https://developer.servicenow.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Joi Validation Documentation](https://joi.dev/api/)
