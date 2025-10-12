# ServiceNow Dynamic Apps Generator

A powerful framework for dynamically generating ServiceNow applications based on end-user needs at runtime. This solution enables rapid application development through configuration-driven approach, eliminating the need for manual ServiceNow app creation.

## 🚀 Features

- **Configuration-Based App Generation**: Define your entire ServiceNow application using JSON configuration
- **Pre-built Templates**: Start quickly with ready-made templates for common use cases (Ticketing, Asset Management, Project Management)
- **Comprehensive Component Support**:
  - Tables with custom fields
  - Forms with multiple sections
  - Business Rules (before/after/async/display)
  - UI Policies with field actions
  - Workflows with activities
  - Roles and security
  - Application menus
- **Schema Validation**: Automatic validation of configurations before generation
- **Runtime Flexibility**: Generate apps dynamically based on user requirements

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Schema](#configuration-schema)
- [Available Templates](#available-templates)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/spandanchakraborty/ServiceNowDynamicApps.git

# Navigate to project directory
cd ServiceNowDynamicApps

# Install dependencies
npm install
```

## 🎯 Quick Start

### 1. Generate App from Template

```javascript
const DynamicAppFactory = require('./src/index');

// Generate a ticketing app from template
const result = await DynamicAppFactory.generateFromTemplate(
  'ticketing',
  {
    appName: 'My Help Desk',
    appScope: 'x_my_helpdesk'
  },
  'https://instance.service-now.com',
  'username',
  'password'
);

console.log('App generated:', result);
```

### 2. Generate App from Custom Configuration

```javascript
const config = {
  appName: 'Custom Support System',
  appScope: 'x_custom_support',
  description: 'A custom support application',
  tables: [{
    name: 'support_ticket',
    label: 'Support Ticket',
    extends: 'task',
    fields: [
      {
        name: 'customer_email',
        type: 'email',
        label: 'Customer Email',
        mandatory: true
      }
    ]
  }],
  // ... more configuration
};

const result = await DynamicAppFactory.generateApp(
  config,
  'https://instance.service-now.com',
  'username',
  'password'
);
```

## 📐 Configuration Schema

### App Configuration Structure

```json
{
  "appName": "string (required, 3-50 chars)",
  "appScope": "string (required, must start with 'x_')",
  "description": "string (required)",
  "tables": [ /* table definitions */ ],
  "forms": [ /* form layouts */ ],
  "businessRules": [ /* business rule scripts */ ],
  "uiPolicies": [ /* UI policies */ ],
  "workflows": [ /* workflow definitions */ ],
  "roles": [ /* security roles */ ],
  "menus": [ /* application menus */ ]
}
```

### Table Definition

```json
{
  "name": "table_name",
  "label": "Table Label",
  "extends": "task",  // parent table
  "fields": [
    {
      "name": "field_name",
      "type": "string|integer|boolean|reference|date|datetime|choice|email|url",
      "label": "Field Label",
      "mandatory": false,
      "maxLength": 100,  // for string types
      "reference": "sys_user",  // for reference types
      "choices": [  // for choice types
        { "value": "val1", "label": "Label 1" }
      ]
    }
  ]
}
```

### Form Layout

```json
{
  "table": "x_scope_table_name",
  "view": "default",
  "sections": [
    {
      "name": "Section Name",
      "fields": ["field1", "field2", "field3"]
    }
  ]
}
```

### Business Rule

```json
{
  "name": "Rule Name",
  "table": "x_scope_table",
  "when": "before|after|async|display",
  "operation": ["insert", "update", "delete", "query"],
  "condition": "field1=value",
  "script": "(function executeRule(current, previous) { /* code */ })(current, previous);"
}
```

### UI Policy

```json
{
  "name": "Policy Name",
  "table": "x_scope_table",
  "onLoad": true,
  "condition": "state=closed",
  "actions": [
    {
      "field": "field_name",
      "mandatory": true,
      "visible": true,
      "readOnly": false
    }
  ]
}
```

## 📚 Available Templates

### 1. Ticketing System (`ticketing`)
A complete ticketing system with:
- Ticket table with type, category, impact fields
- Priority auto-assignment based on impact
- Resolution notes requirement on closure
- User and agent roles
- Menu items for ticket management

### 2. Asset Management (`assetManagement`)
Track organizational assets with:
- Asset table with tag, type, purchase info
- Assignment to users and locations
- Warranty tracking
- Admin role and menus

### 3. Project Management (`projectManagement`)
Manage projects and tasks with:
- Project table with timeline and budget
- Project manager assignment
- Status tracking
- Project manager role

## 💡 Usage Examples

### Example 1: List Available Templates

```javascript
const templates = DynamicAppFactory.getTemplates();
console.log('Available templates:', templates);
// Output: ['ticketing', 'assetManagement', 'projectManagement']
```

### Example 2: Validate Configuration

```javascript
const validation = DynamicAppFactory.validateConfiguration(config);
if (validation.error) {
  console.error('Validation errors:', validation.error.details);
} else {
  console.log('Configuration is valid!');
}
```

### Example 3: Generate from JSON File

```javascript
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const result = await DynamicAppFactory.generateApp(
  config,
  instanceUrl,
  username,
  password
);
```

### Example 4: Runtime App Generation

```javascript
// Collect user requirements at runtime
const userRequirements = {
  appType: 'ticketing',
  appName: req.body.appName,
  scope: req.body.scope
};

// Generate app based on user input
const result = await DynamicAppFactory.generateFromTemplate(
  userRequirements.appType,
  {
    appName: userRequirements.appName,
    appScope: userRequirements.scope
  },
  instanceUrl,
  username,
  password
);

res.json({ success: true, result });
```

## 📖 API Reference

### DynamicAppFactory

#### `createGenerator(instanceUrl, username, password)`
Creates a new app generator instance.

#### `validateConfiguration(config)`
Validates an app configuration against the schema.

#### `getTemplates()`
Returns list of available templates.

#### `getTemplate(templateName)`
Returns a specific template configuration.

#### `generateApp(config, instanceUrl, username, password)`
Generates an app from configuration.

#### `generateFromTemplate(templateName, customization, instanceUrl, username, password)`
Generates an app from a template with customizations.

### DynamicAppGenerator

#### `generateApp(config)`
Main method to generate a complete ServiceNow application.

#### `generateFromTemplate(templateName, customization)`
Generate from a pre-built template.

## 🎨 Best Practices

1. **Scope Naming**: Always use lowercase with underscores, starting with `x_`
   - ✅ Good: `x_custom_support`
   - ❌ Bad: `CustomSupport` or `custom_support`

2. **Table Design**: Extend from appropriate base tables
   - Use `task` for workflow-based apps
   - Use `cmdb_ci` for asset/configuration items
   - Use base table for simple data storage

3. **Field Types**: Choose appropriate field types
   - Use `reference` for lookups to other tables
   - Use `choice` for predefined options
   - Use `email` for email validation
   - Use `url` for URL validation

4. **Security**: Always define roles and assign them to menus
   - Create granular roles (viewer, editor, admin)
   - Apply principle of least privilege

5. **Business Rules**: Keep scripts simple and focused
   - Use `before` for validation and data modification
   - Use `after` for notifications and related record updates
   - Use `async` for non-critical background tasks

6. **UI Policies**: Use for dynamic form behavior
   - Set field visibility based on conditions
   - Make fields mandatory/readonly dynamically
   - Improve user experience

## 🔄 How It Works

1. **Configuration**: Define your app requirements in JSON format
2. **Validation**: Schema validates the configuration
3. **Generation**: Generator creates ServiceNow components in order:
   - Application scope
   - Tables and fields
   - Forms and layouts
   - Business rules
   - UI policies
   - Workflows
   - Roles
   - Menus
4. **Deployment**: Components are created in ServiceNow instance

## 🧪 Testing

Run the examples to test the functionality:

```bash
# Run all usage examples
node examples/usage-examples.js
```

## 📝 Configuration Examples

See the `examples/` directory for complete configuration examples:
- `customer-support-config.json` - Full customer support system
- `usage-examples.js` - JavaScript usage examples

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/spandanchakraborty/ServiceNowDynamicApps).