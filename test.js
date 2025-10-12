/**
 * Simple test suite for the Dynamic App Generator
 * Run with: node test.js
 */

const DynamicAppFactory = require('./src/index');
const helpers = require('./src/utils/helpers');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

console.log('\n🧪 Running Tests...\n');

// Test 1: Template listing
test('Should list all available templates', () => {
  const templates = DynamicAppFactory.getTemplates();
  if (templates.length !== 3) throw new Error('Expected 3 templates');
  if (!templates.includes('ticketing')) throw new Error('Missing ticketing template');
  if (!templates.includes('assetManagement')) throw new Error('Missing assetManagement template');
  if (!templates.includes('projectManagement')) throw new Error('Missing projectManagement template');
});

// Test 2: Template retrieval
test('Should retrieve a specific template', () => {
  const template = DynamicAppFactory.getTemplate('ticketing');
  if (!template) throw new Error('Template not found');
  if (template.appName !== 'Custom Ticketing System') throw new Error('Invalid template name');
  if (template.appScope !== 'x_custom_ticket') throw new Error('Invalid template scope');
});

// Test 3: Configuration validation - valid config
test('Should validate a valid configuration', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'A test application',
    tables: [{
      name: 'test_table',
      label: 'Test Table',
      fields: [{
        name: 'test_field',
        type: 'string',
        label: 'Test Field',
        maxLength: 100
      }]
    }],
    forms: [{
      table: 'x_test_app_test_table',
      sections: [{
        name: 'Test Section',
        fields: ['test_field']
      }]
    }],
    roles: [{
      name: 'user',
      description: 'User role'
    }],
    menus: [{
      name: 'test_menu',
      title: 'Test Menu',
      table: 'x_test_app_test_table',
      type: 'list',
      roles: []
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('Validation should pass');
});

// Test 4: Configuration validation - invalid scope
test('Should reject invalid scope format', () => {
  const config = {
    appName: 'Test App',
    appScope: 'invalid_scope', // Should start with x_
    description: 'A test application'
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (!validation.error) throw new Error('Validation should fail');
});

// Test 5: Configuration validation - missing required fields
test('Should reject config with missing required fields', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app'
    // Missing description
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (!validation.error) throw new Error('Validation should fail');
});

// Test 6: Helper - scope generation
test('Should generate valid scope from app name', () => {
  const scope = helpers.generateScopeFromName('My Test App');
  if (scope !== 'x_my_test_app') throw new Error(`Expected x_my_test_app, got ${scope}`);
});

// Test 7: Helper - table name generation
test('Should generate valid table name from label', () => {
  const tableName = helpers.generateTableName('Support Ticket');
  if (tableName !== 'support_ticket') throw new Error(`Expected support_ticket, got ${tableName}`);
});

// Test 8: Helper - scope validation
test('Should validate scope format correctly', () => {
  if (!helpers.isValidScope('x_my_app')) throw new Error('Valid scope rejected');
  if (helpers.isValidScope('my_app')) throw new Error('Invalid scope accepted');
  if (helpers.isValidScope('X_my_app')) throw new Error('Uppercase scope accepted');
});

// Test 9: Sample config generation
test('Should generate sample config from use case', () => {
  const config = helpers.generateSampleConfig('ticketing', {
    appName: 'My Tickets',
    appScope: 'x_my_tickets'
  });
  
  if (config.appName !== 'My Tickets') throw new Error('App name not customized');
  if (config.appScope !== 'x_my_tickets') throw new Error('App scope not customized');
  if (!config.tables || config.tables.length === 0) throw new Error('No tables in config');
});

// Test 10: Generator creation
test('Should create a generator instance', () => {
  const generator = DynamicAppFactory.createGenerator(
    'https://test.service-now.com',
    'admin',
    'password'
  );
  
  if (!generator) throw new Error('Generator not created');
});

// Test 11: App generation (async)
asyncTest('Should generate an app from configuration', async () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'A test application',
    tables: [{
      name: 'test_table',
      label: 'Test Table',
      fields: [{
        name: 'test_field',
        type: 'string',
        label: 'Test Field',
        maxLength: 100
      }]
    }]
  };

  const result = await DynamicAppFactory.generateApp(
    config,
    'https://test.service-now.com',
    'admin',
    'password'
  );

  if (!result.success) throw new Error('App generation failed');
  if (result.appScope !== 'x_test_app') throw new Error('Incorrect scope');
  if (!result.components.application) throw new Error('No application component');
});

// Test 12: Template-based generation (async)
asyncTest('Should generate app from template', async () => {
  const result = await DynamicAppFactory.generateFromTemplate(
    'ticketing',
    { appName: 'Test Tickets', appScope: 'x_test_tickets' },
    'https://test.service-now.com',
    'admin',
    'password'
  );

  if (!result.success) throw new Error('Template generation failed');
  if (result.appScope !== 'x_test_tickets') throw new Error('Incorrect scope');
});

// Test 13: Field type validation
test('Should validate field types correctly', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'Test',
    tables: [{
      name: 'test',
      label: 'Test',
      fields: [{
        name: 'email_field',
        type: 'email',
        label: 'Email'
      }]
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('Email field validation failed');
});

// Test 14: Choice field validation
test('Should validate choice fields with options', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'Test',
    tables: [{
      name: 'test',
      label: 'Test',
      fields: [{
        name: 'status',
        type: 'choice',
        label: 'Status',
        choices: [
          { value: 'new', label: 'New' },
          { value: 'active', label: 'Active' }
        ]
      }]
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('Choice field validation failed');
});

// Test 15: Reference field validation
test('Should validate reference fields with reference table', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'Test',
    tables: [{
      name: 'test',
      label: 'Test',
      fields: [{
        name: 'user_ref',
        type: 'reference',
        label: 'User',
        reference: 'sys_user'
      }]
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('Reference field validation failed');
});

// Test 16: Business rule validation
test('Should validate business rules', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'Test',
    businessRules: [{
      name: 'Test Rule',
      table: 'x_test_app_test',
      when: 'before',
      operation: ['insert'],
      condition: '',
      script: 'current.value = "test";'
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('Business rule validation failed');
});

// Test 17: UI Policy validation
test('Should validate UI policies', () => {
  const config = {
    appName: 'Test App',
    appScope: 'x_test_app',
    description: 'Test',
    uiPolicies: [{
      name: 'Test Policy',
      table: 'x_test_app_test',
      onLoad: true,
      condition: 'state=closed',
      actions: [{
        field: 'notes',
        mandatory: true,
        visible: true
      }]
    }]
  };

  const validation = DynamicAppFactory.validateConfiguration(config);
  if (validation.error) throw new Error('UI policy validation failed');
});

// Run async tests
(async () => {
  await asyncTest('Should generate an app from configuration', async () => {
    const config = {
      appName: 'Test App',
      appScope: 'x_test_app',
      description: 'A test application',
      tables: [{
        name: 'test_table',
        label: 'Test Table',
        fields: [{
          name: 'test_field',
          type: 'string',
          label: 'Test Field',
          maxLength: 100
        }]
      }]
    };

    const result = await DynamicAppFactory.generateApp(
      config,
      'https://test.service-now.com',
      'admin',
      'password'
    );

    if (!result.success) throw new Error('App generation failed');
    if (result.appScope !== 'x_test_app') throw new Error('Incorrect scope');
    if (!result.components.application) throw new Error('No application component');
  });

  await asyncTest('Should generate app from template', async () => {
    const result = await DynamicAppFactory.generateFromTemplate(
      'ticketing',
      { appName: 'Test Tickets', appScope: 'x_test_tickets' },
      'https://test.service-now.com',
      'admin',
      'password'
    );

    if (!result.success) throw new Error('Template generation failed');
    if (result.appScope !== 'x_test_tickets') throw new Error('Incorrect scope');
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed.\n');
    process.exit(1);
  }
})();
