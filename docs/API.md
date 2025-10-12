# API Reference

## Table of Contents

- [DynamicAppFactory](#dynamicappfactory)
- [DynamicAppGenerator](#dynamicappgenerator)
- [ServiceNowClient](#servicenowclient)
- [Helper Functions](#helper-functions)
- [Schema Validation](#schema-validation)

## DynamicAppFactory

Main facade class for all dynamic app generation operations.

### Static Methods

#### `createGenerator(instanceUrl, username, password)`

Creates a new app generator instance.

**Parameters:**
- `instanceUrl` (string): ServiceNow instance URL (e.g., 'https://dev12345.service-now.com')
- `username` (string): ServiceNow username
- `password` (string): ServiceNow password

**Returns:** `DynamicAppGenerator` instance

**Example:**
```javascript
const generator = DynamicAppFactory.createGenerator(
  'https://dev12345.service-now.com',
  'admin',
  'password'
);
```

#### `validateConfiguration(config)`

Validates an app configuration against the schema.

**Parameters:**
- `config` (object): Application configuration object

**Returns:** Object with `error` and `value` properties
- `error`: Validation error details (null if valid)
- `value`: Validated configuration with defaults applied

**Example:**
```javascript
const validation = DynamicAppFactory.validateConfiguration(config);
if (validation.error) {
  console.error('Validation failed:', validation.error.details);
} else {
  console.log('Valid config:', validation.value);
}
```

#### `getTemplates()`

Returns list of available template names.

**Returns:** Array of template names (strings)

**Example:**
```javascript
const templates = DynamicAppFactory.getTemplates();
// Returns: ['ticketing', 'assetManagement', 'projectManagement']
```

#### `getTemplate(templateName)`

Returns a specific template configuration.

**Parameters:**
- `templateName` (string): Name of the template

**Returns:** Template configuration object

**Example:**
```javascript
const ticketingTemplate = DynamicAppFactory.getTemplate('ticketing');
```

#### `generateApp(config, instanceUrl, username, password)`

Generates a complete ServiceNow application from configuration.

**Parameters:**
- `config` (object): Application configuration
- `instanceUrl` (string): ServiceNow instance URL
- `username` (string): ServiceNow username
- `password` (string): ServiceNow password

**Returns:** Promise resolving to generation result

**Example:**
```javascript
const result = await DynamicAppFactory.generateApp(
  config,
  'https://dev12345.service-now.com',
  'admin',
  'password'
);
```

#### `generateFromTemplate(templateName, customization, instanceUrl, username, password)`

Generates an app from a pre-built template with customizations.

**Parameters:**
- `templateName` (string): Template name
- `customization` (object): Custom parameters to override template defaults
- `instanceUrl` (string): ServiceNow instance URL
- `username` (string): ServiceNow username
- `password` (string): ServiceNow password

**Returns:** Promise resolving to generation result

**Example:**
```javascript
const result = await DynamicAppFactory.generateFromTemplate(
  'ticketing',
  { appName: 'My Help Desk', appScope: 'x_my_helpdesk' },
  'https://dev12345.service-now.com',
  'admin',
  'password'
);
```

## DynamicAppGenerator

Core generator class that orchestrates app creation.

### Constructor

```javascript
new DynamicAppGenerator(serviceNowClient)
```

**Parameters:**
- `serviceNowClient` (ServiceNowClient): Initialized ServiceNow client

### Methods

#### `generateApp(config)`

Generates a complete ServiceNow application.

**Parameters:**
- `config` (object): Validated application configuration

**Returns:** Promise resolving to generation result object

**Result Object Structure:**
```javascript
{
  success: true,
  appScope: 'x_my_app',
  components: {
    application: { success: true, sys_id: '...', data: {...} },
    tables: [...],
    forms: [...],
    businessRules: [...],
    uiPolicies: [...],
    workflows: [...],
    roles: [...],
    menus: [...]
  },
  generationLog: [
    { timestamp: '2025-10-12T...', message: '...' },
    ...
  ]
}
```

#### `generateFromTemplate(templateName, customization)`

Generates app from a template.

**Parameters:**
- `templateName` (string): Template name
- `customization` (object): Customization parameters

**Returns:** Promise resolving to generation result

#### `log(message)`

Logs a generation step.

**Parameters:**
- `message` (string): Log message

## ServiceNowClient

Low-level client for ServiceNow API interactions.

### Constructor

```javascript
new ServiceNowClient(instanceUrl, username, password)
```

### Methods

#### `createApplication(appConfig)`

Creates a new application scope.

**Returns:** Promise resolving to creation result

#### `createTable(tableConfig, appScope)`

Creates a table in ServiceNow.

**Parameters:**
- `tableConfig` (object): Table configuration
- `appScope` (string): Application scope

**Returns:** Promise resolving to creation result

#### `createField(fieldConfig, tableName, appScope)`

Creates a table field/column.

**Parameters:**
- `fieldConfig` (object): Field configuration
- `tableName` (string): Full table name
- `appScope` (string): Application scope

**Returns:** Promise resolving to creation result

#### `createForm(formConfig, appScope)`

Creates a form layout.

**Returns:** Promise resolving to creation result

#### `createBusinessRule(ruleConfig, appScope)`

Creates a business rule.

**Returns:** Promise resolving to creation result

#### `createUIPolicy(policyConfig, appScope)`

Creates a UI policy.

**Returns:** Promise resolving to creation result

#### `createWorkflow(workflowConfig, appScope)`

Creates a workflow.

**Returns:** Promise resolving to creation result

#### `createRole(roleConfig, appScope)`

Creates a security role.

**Returns:** Promise resolving to creation result

#### `createMenu(menuConfig, appScope)`

Creates an application menu.

**Returns:** Promise resolving to creation result

## Helper Functions

Utility functions from `src/utils/helpers.js`.

### `generateScopeFromName(appName)`

Generates a valid ServiceNow scope from app name.

**Parameters:**
- `appName` (string): Application name

**Returns:** string - Valid scope (e.g., 'x_my_app')

**Example:**
```javascript
const scope = generateScopeFromName('My Custom App');
// Returns: 'x_my_custom_app'
```

### `generateTableName(label)`

Generates a valid table name from label.

**Example:**
```javascript
const tableName = generateTableName('Support Ticket');
// Returns: 'support_ticket'
```

### `generateFieldName(label)`

Generates a valid field name from label.

### `isValidScope(scope)`

Validates ServiceNow scope format.

**Returns:** boolean

### `generateSampleConfig(useCase, options)`

Generates a sample configuration for a use case.

**Parameters:**
- `useCase` (string): Use case type ('ticketing', 'asset', 'project')
- `options` (object): Customization options

**Returns:** Configuration object

### `formatGenerationResult(result)`

Formats generation result for display.

**Returns:** Formatted string output

### `exportConfigToFile(config, filename)`

Exports configuration to JSON file.

**Returns:** Output file path

### `importConfigFromFile(filename)`

Imports configuration from JSON file.

**Returns:** Configuration object

## Schema Validation

### Configuration Schema

The full configuration schema validates the following structure:

```javascript
{
  appName: string,           // Required, 3-50 characters
  appScope: string,          // Required, must start with 'x_'
  description: string,       // Required
  
  tables: [{
    name: string,
    label: string,
    extends: string,         // Default: 'task'
    fields: [{
      name: string,
      type: string,          // 'string', 'integer', 'boolean', 'reference', 
                            // 'date', 'datetime', 'choice', 'email', 'url'
      label: string,
      mandatory: boolean,    // Default: false
      maxLength: number,     // For string types
      reference: string,     // For reference types
      choices: [{           // For choice types
        value: string,
        label: string
      }]
    }]
  }],
  
  forms: [{
    table: string,
    view: string,           // Default: 'default'
    sections: [{
      name: string,
      fields: [string]
    }]
  }],
  
  businessRules: [{
    name: string,
    table: string,
    when: string,          // 'before', 'after', 'async', 'display'
    operation: [string],   // 'insert', 'update', 'delete', 'query'
    condition: string,
    script: string
  }],
  
  uiPolicies: [{
    name: string,
    table: string,
    onLoad: boolean,       // Default: true
    condition: string,
    actions: [{
      field: string,
      mandatory: boolean,
      visible: boolean,
      readOnly: boolean
    }]
  }],
  
  workflows: [{
    name: string,
    table: string,
    description: string,
    activities: [{
      type: string,        // 'approval', 'notification', 'script', 'condition'
      name: string,
      config: object
    }]
  }],
  
  roles: [{
    name: string,
    description: string,
    elevatePrivilege: boolean  // Default: false
  }],
  
  menus: [{
    name: string,
    title: string,
    table: string,
    type: string,         // 'list', 'form', 'separator', 'module'
    roles: [string]       // Default: []
  }]
}
```

### Field Type Mappings

| App Config Type | ServiceNow Internal Type |
|----------------|-------------------------|
| `string` | `string` |
| `integer` | `integer` |
| `boolean` | `boolean` |
| `reference` | `reference` |
| `date` | `glide_date` |
| `datetime` | `glide_date_time` |
| `choice` | `choice` |
| `email` | `email` |
| `url` | `url` |

## Error Handling

### Validation Errors

```javascript
{
  error: {
    details: [
      { message: 'Validation error message', path: ['field', 'path'] }
    ]
  }
}
```

### Generation Errors

```javascript
{
  success: false,
  error: 'Error message',
  details: ['Detail 1', 'Detail 2'],
  generationLog: [...]
}
```

## Usage Patterns

### Pattern 1: Simple Generation

```javascript
const result = await DynamicAppFactory.generateApp(
  config,
  instanceUrl,
  username,
  password
);
```

### Pattern 2: Template with Customization

```javascript
const result = await DynamicAppFactory.generateFromTemplate(
  'ticketing',
  { appName: 'Custom Name' },
  instanceUrl,
  username,
  password
);
```

### Pattern 3: Advanced with Generator Instance

```javascript
const generator = DynamicAppFactory.createGenerator(
  instanceUrl,
  username,
  password
);

const result1 = await generator.generateApp(config1);
const result2 = await generator.generateApp(config2);
```

### Pattern 4: Validation Before Generation

```javascript
const validation = DynamicAppFactory.validateConfiguration(config);
if (validation.error) {
  throw new Error('Invalid configuration');
}

const result = await DynamicAppFactory.generateApp(
  validation.value,
  instanceUrl,
  username,
  password
);
```
