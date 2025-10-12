#!/usr/bin/env node

/**
 * Demo script showcasing the Dynamic App Generator capabilities
 */

const DynamicAppFactory = require('./src/index');
const helpers = require('./src/utils/helpers');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   ServiceNow Dynamic Apps Generator - Demo                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function demo() {
  try {
    // Demo 1: Show available templates
    console.log('📚 Demo 1: Available Templates\n');
    console.log('Templates you can use out-of-the-box:');
    const templates = DynamicAppFactory.getTemplates();
    templates.forEach((name, index) => {
      const template = DynamicAppFactory.getTemplate(name);
      console.log(`  ${index + 1}. ${name}`);
      console.log(`     - ${template.appName}`);
      console.log(`     - ${template.description}`);
    });

    // Demo 2: Create a custom configuration
    console.log('\n\n📝 Demo 2: Creating a Custom App Configuration\n');
    
    const customConfig = {
      appName: 'Employee Onboarding',
      appScope: 'x_emp_onboarding',
      description: 'Track and manage employee onboarding process',
      
      tables: [{
        name: 'onboarding_task',
        label: 'Onboarding Task',
        extends: 'task',
        fields: [
          {
            name: 'employee_name',
            type: 'string',
            label: 'Employee Name',
            maxLength: 100,
            mandatory: true
          },
          {
            name: 'department',
            type: 'choice',
            label: 'Department',
            mandatory: true,
            choices: [
              { value: 'it', label: 'IT' },
              { value: 'hr', label: 'Human Resources' },
              { value: 'finance', label: 'Finance' },
              { value: 'sales', label: 'Sales' }
            ]
          },
          {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            mandatory: true
          },
          {
            name: 'task_status',
            type: 'choice',
            label: 'Task Status',
            mandatory: true,
            choices: [
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ]
          },
          {
            name: 'hr_manager',
            type: 'reference',
            label: 'HR Manager',
            reference: 'sys_user',
            mandatory: false
          }
        ]
      }],
      
      forms: [{
        table: 'x_emp_onboarding_onboarding_task',
        view: 'default',
        sections: [
          {
            name: 'Employee Information',
            fields: ['number', 'employee_name', 'department', 'start_date']
          },
          {
            name: 'Task Details',
            fields: ['short_description', 'task_status', 'priority']
          },
          {
            name: 'Assignment',
            fields: ['hr_manager', 'assigned_to', 'assignment_group']
          }
        ]
      }],
      
      businessRules: [{
        name: 'Auto-assign HR Manager Based on Department',
        table: 'x_emp_onboarding_onboarding_task',
        when: 'before',
        operation: ['insert', 'update'],
        condition: 'department.changes()',
        script: `
(function executeRule(current, previous) {
  var deptToManager = {
    'it': 'IT HR Manager',
    'hr': 'HR Director',
    'finance': 'Finance HR Manager',
    'sales': 'Sales HR Manager'
  };
  
  var managerName = deptToManager[current.department.toString()];
  if (managerName) {
    // In real implementation, this would lookup the actual user
    gs.info('Would assign HR Manager: ' + managerName);
  }
})(current, previous);
        `.trim()
      }],
      
      uiPolicies: [{
        name: 'Show HR Manager for HR Department',
        table: 'x_emp_onboarding_onboarding_task',
        onLoad: true,
        condition: 'department=hr',
        actions: [{
          field: 'hr_manager',
          mandatory: true,
          visible: true,
          readOnly: false
        }]
      }],
      
      roles: [
        {
          name: 'hr_admin',
          description: 'HR Administrator for onboarding',
          elevatePrivilege: false
        },
        {
          name: 'manager',
          description: 'Department Manager',
          elevatePrivilege: false
        }
      ],
      
      menus: [
        {
          name: 'onboarding_dashboard',
          title: 'Onboarding Dashboard',
          table: 'x_emp_onboarding_onboarding_task',
          type: 'list',
          roles: ['x_emp_onboarding.hr_admin']
        },
        {
          name: 'new_onboarding',
          title: 'Create Onboarding Task',
          table: 'x_emp_onboarding_onboarding_task',
          type: 'form',
          roles: ['x_emp_onboarding.hr_admin']
        }
      ]
    };

    console.log('Created configuration for: Employee Onboarding System');
    console.log(`  App Name: ${customConfig.appName}`);
    console.log(`  App Scope: ${customConfig.appScope}`);
    console.log(`  Components:`);
    console.log(`    - Tables: ${customConfig.tables.length}`);
    console.log(`    - Forms: ${customConfig.forms.length}`);
    console.log(`    - Business Rules: ${customConfig.businessRules.length}`);
    console.log(`    - UI Policies: ${customConfig.uiPolicies.length}`);
    console.log(`    - Roles: ${customConfig.roles.length}`);
    console.log(`    - Menus: ${customConfig.menus.length}`);

    // Demo 3: Validate the configuration
    console.log('\n\n✅ Demo 3: Validating Configuration\n');
    
    const validation = DynamicAppFactory.validateConfiguration(customConfig);
    if (validation.error) {
      console.log('❌ Validation failed!');
      validation.error.details.forEach(detail => {
        console.log(`  - ${detail.message}`);
      });
    } else {
      console.log('✅ Configuration is valid!');
      console.log('   All fields and structure meet ServiceNow requirements.');
    }

    // Demo 4: Simulate app generation
    console.log('\n\n🚀 Demo 4: Simulating App Generation\n');
    console.log('Note: This is a simulation - no actual ServiceNow instance required for demo.\n');

    // Mock credentials for demo
    const mockInstanceUrl = 'https://dev12345.service-now.com';
    const mockUsername = 'admin';
    const mockPassword = 'demo_password';

    const result = await DynamicAppFactory.generateApp(
      customConfig,
      mockInstanceUrl,
      mockUsername,
      mockPassword
    );

    console.log(helpers.formatGenerationResult(result));

    // Demo 5: Using a template
    console.log('\n\n📋 Demo 5: Generating from Template\n');
    
    const ticketingResult = await DynamicAppFactory.generateFromTemplate(
      'ticketing',
      {
        appName: 'IT Help Desk',
        appScope: 'x_it_helpdesk',
        description: 'IT Department help desk system'
      },
      mockInstanceUrl,
      mockUsername,
      mockPassword
    );

    console.log('Generated from ticketing template with customizations:');
    console.log(`  App Name: IT Help Desk`);
    console.log(`  App Scope: x_it_helpdesk`);
    console.log(`  Status: ${ticketingResult.success ? 'Success ✅' : 'Failed ❌'}`);

    // Demo 6: Utility functions
    console.log('\n\n🛠️  Demo 6: Utility Functions\n');
    
    console.log('Scope generation:');
    console.log(`  "My Custom App" → ${helpers.generateScopeFromName('My Custom App')}`);
    console.log(`  "Employee Portal" → ${helpers.generateScopeFromName('Employee Portal')}`);
    
    console.log('\nTable name generation:');
    console.log(`  "Support Ticket" → ${helpers.generateTableName('Support Ticket')}`);
    console.log(`  "IT Asset" → ${helpers.generateTableName('IT Asset')}`);
    
    console.log('\nScope validation:');
    console.log(`  "x_my_app" → ${helpers.isValidScope('x_my_app') ? 'Valid ✅' : 'Invalid ❌'}`);
    console.log(`  "my_app" → ${helpers.isValidScope('my_app') ? 'Valid ✅' : 'Invalid ❌'}`);

    // Demo 7: Export configuration
    console.log('\n\n💾 Demo 7: Export Configuration to File\n');
    
    const exportPath = helpers.exportConfigToFile(
      customConfig,
      '/tmp/employee_onboarding_config.json'
    );
    console.log(`Configuration exported to: ${exportPath}`);
    console.log('You can now edit this file and use it with:');
    console.log('  node cli.js generate /tmp/employee_onboarding_config.json');

    // Summary
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   Demo Complete! 🎉                                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('What you learned:');
    console.log('  ✅ Browse available templates');
    console.log('  ✅ Create custom configurations');
    console.log('  ✅ Validate configurations');
    console.log('  ✅ Generate apps programmatically');
    console.log('  ✅ Use templates with customizations');
    console.log('  ✅ Utilize helper functions');
    console.log('  ✅ Export/import configurations');
    
    console.log('\nNext steps:');
    console.log('  1. Try: node cli.js list-templates');
    console.log('  2. Try: node cli.js sample ticketing "My App"');
    console.log('  3. Try: node cli.js validate examples/customer-support-config.json');
    console.log('  4. Read: docs/GETTING_STARTED.md');
    console.log('  5. Read: docs/API.md');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Demo Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  demo();
}

module.exports = { demo };
