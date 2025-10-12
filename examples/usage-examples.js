const DynamicAppFactory = require('../src/index');

/**
 * Example 1: Generate app from a custom configuration
 */
async function example1_CustomConfiguration() {
  console.log('=== Example 1: Generate App from Custom Configuration ===\n');

  const config = {
    appName: 'IT Asset Tracker',
    appScope: 'x_it_assets',
    description: 'Track IT assets and their assignments',
    
    tables: [{
      name: 'it_asset',
      label: 'IT Asset',
      extends: 'cmdb_ci',
      fields: [
        {
          name: 'serial_number',
          type: 'string',
          label: 'Serial Number',
          maxLength: 50,
          mandatory: true
        },
        {
          name: 'asset_owner',
          type: 'reference',
          label: 'Asset Owner',
          reference: 'sys_user',
          mandatory: true
        },
        {
          name: 'purchase_date',
          type: 'date',
          label: 'Purchase Date',
          mandatory: false
        }
      ]
    }],
    
    forms: [{
      table: 'x_it_assets_it_asset',
      view: 'default',
      sections: [{
        name: 'Asset Information',
        fields: ['name', 'serial_number', 'asset_owner', 'purchase_date']
      }]
    }],
    
    roles: [{
      name: 'viewer',
      description: 'Can view assets'
    }],
    
    menus: [{
      name: 'asset_list',
      title: 'IT Assets',
      table: 'x_it_assets_it_asset',
      type: 'list',
      roles: ['x_it_assets.viewer']
    }]
  };

  // Validate configuration first
  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) {
    console.error('Configuration validation failed:', validation.error.details);
    return;
  }

  // Generate the app
  const result = await DynamicAppFactory.generateApp(
    config,
    'https://dev12345.service-now.com',
    'admin',
    'password'
  );

  console.log('Generation Result:', JSON.stringify(result, null, 2));
}

/**
 * Example 2: Generate app from a template
 */
async function example2_UseTemplate() {
  console.log('\n=== Example 2: Generate App from Template ===\n');

  // List available templates
  const templates = DynamicAppFactory.getTemplates();
  console.log('Available templates:', templates);

  // Generate from ticketing template with customization
  const result = await DynamicAppFactory.generateFromTemplate(
    'ticketing',
    {
      appName: 'Help Desk Tickets',
      appScope: 'x_helpdesk'
    },
    'https://dev12345.service-now.com',
    'admin',
    'password'
  );

  console.log('Generation Result:', JSON.stringify(result, null, 2));
}

/**
 * Example 3: Validate configuration without generating
 */
function example3_ValidateOnly() {
  console.log('\n=== Example 3: Validate Configuration ===\n');

  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'A test application',
    tables: [{
      name: 'test_table',
      label: 'Test Table',
      fields: []
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  
  if (validation.error) {
    console.log('Validation failed:');
    validation.error.details.forEach(detail => {
      console.log(`  - ${detail.message}`);
    });
  } else {
    console.log('Configuration is valid!');
    console.log('Validated config:', JSON.stringify(validation.value, null, 2));
  }
}

/**
 * Example 4: Using templates as starting point
 */
function example4_ExploreTemplates() {
  console.log('\n=== Example 4: Explore Templates ===\n');

  const templates = DynamicAppFactory.getTemplates();
  
  templates.forEach(templateName => {
    const template = DynamicAppFactory.getTemplate(templateName);
    console.log(`\nTemplate: ${templateName}`);
    console.log(`  App Name: ${template.appName}`);
    console.log(`  Scope: ${template.appScope}`);
    console.log(`  Description: ${template.description}`);
    console.log(`  Tables: ${template.tables.length}`);
    console.log(`  Forms: ${template.forms.length}`);
    console.log(`  Business Rules: ${template.businessRules?.length || 0}`);
    console.log(`  UI Policies: ${template.uiPolicies?.length || 0}`);
    console.log(`  Roles: ${template.roles.length}`);
    console.log(`  Menus: ${template.menus.length}`);
  });
}

/**
 * Example 5: Load config from JSON file
 */
async function example5_LoadFromFile() {
  console.log('\n=== Example 5: Load Configuration from File ===\n');

  const fs = require('fs');
  const path = require('path');

  const configPath = path.join(__dirname, 'customer-support-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  console.log('Loaded configuration for:', config.appName);

  // Validate
  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) {
    console.error('Configuration validation failed');
    return;
  }

  // Generate
  const result = await DynamicAppFactory.generateApp(
    config,
    'https://dev12345.service-now.com',
    'admin',
    'password'
  );

  console.log('\nApp generated successfully!');
  console.log('Scope:', result.appScope);
  console.log('Components created:', Object.keys(result.components));
}

// Run examples
async function runExamples() {
  try {
    await example1_CustomConfiguration();
    await example2_UseTemplate();
    example3_ValidateOnly();
    example4_ExploreTemplates();
    await example5_LoadFromFile();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  example1_CustomConfiguration,
  example2_UseTemplate,
  example3_ValidateOnly,
  example4_ExploreTemplates,
  example5_LoadFromFile
};
