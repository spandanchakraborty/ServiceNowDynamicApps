#!/usr/bin/env node

const DynamicAppFactory = require('./src/index');
const helpers = require('./src/utils/helpers');

/**
 * Command-line interface for the Dynamic App Generator
 */

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'list-templates':
        listTemplates();
        break;
      
      case 'generate':
        await generateApp();
        break;
      
      case 'validate':
        await validateConfig();
        break;
      
      case 'sample':
        generateSample();
        break;
      
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
ServiceNow Dynamic App Generator CLI

Usage: node cli.js <command> [options]

Commands:
  list-templates              List all available templates
  
  generate <config.json>      Generate app from configuration file
                             Requires: INSTANCE_URL, SN_USER, SN_PASS env vars
  
  validate <config.json>      Validate a configuration file
  
  sample <use-case> [name]    Generate a sample config for a use case
                             Use cases: ticketing, asset, project
  
  help                        Show this help message

Examples:
  node cli.js list-templates
  node cli.js validate examples/customer-support-config.json
  node cli.js sample ticketing "My Help Desk"
  node cli.js generate config.json

Environment Variables (for generate command):
  INSTANCE_URL    ServiceNow instance URL (e.g., https://dev12345.service-now.com)
  SN_USER         ServiceNow username
  SN_PASS         ServiceNow password
`);
}

function listTemplates() {
  console.log('\n📋 Available Templates:\n');
  
  const templates = DynamicAppFactory.getTemplates();
  
  templates.forEach(name => {
    const template = DynamicAppFactory.getTemplate(name);
    console.log(`  ${name}`);
    console.log(`    Name: ${template.appName}`);
    console.log(`    Scope: ${template.appScope}`);
    console.log(`    Description: ${template.description}`);
    console.log(`    Components: ${template.tables.length} tables, ${template.forms.length} forms, ${template.roles.length} roles\n`);
  });
}

async function validateConfig() {
  const configFile = args[1];
  
  if (!configFile) {
    console.error('Error: Please provide a configuration file');
    console.log('Usage: node cli.js validate <config.json>');
    process.exit(1);
  }

  console.log(`\n🔍 Validating configuration: ${configFile}\n`);

  const config = helpers.importConfigFromFile(configFile);
  const validation = DynamicAppFactory.validateConfiguration(config);

  if (validation.error) {
    console.log('❌ Validation failed:\n');
    validation.error.details.forEach(detail => {
      console.log(`  • ${detail.message}`);
    });
    process.exit(1);
  } else {
    console.log('✅ Configuration is valid!');
    console.log('\nValidated configuration:');
    console.log(`  App Name: ${validation.value.appName}`);
    console.log(`  App Scope: ${validation.value.appScope}`);
    console.log(`  Tables: ${validation.value.tables.length}`);
    console.log(`  Forms: ${validation.value.forms.length}`);
    console.log(`  Business Rules: ${validation.value.businessRules.length}`);
    console.log(`  UI Policies: ${validation.value.uiPolicies.length}`);
    console.log(`  Roles: ${validation.value.roles.length}`);
    console.log(`  Menus: ${validation.value.menus.length}`);
  }
}

async function generateApp() {
  const configFile = args[1];
  
  if (!configFile) {
    console.error('Error: Please provide a configuration file');
    console.log('Usage: node cli.js generate <config.json>');
    process.exit(1);
  }

  // Check environment variables
  const instanceUrl = process.env.INSTANCE_URL;
  const username = process.env.SN_USER;
  const password = process.env.SN_PASS;

  if (!instanceUrl || !username || !password) {
    console.error('Error: Missing environment variables');
    console.log('Please set: INSTANCE_URL, SN_USER, SN_PASS');
    process.exit(1);
  }

  console.log(`\n🚀 Generating app from: ${configFile}\n`);

  const config = helpers.importConfigFromFile(configFile);
  const result = await DynamicAppFactory.generateApp(
    config,
    instanceUrl,
    username,
    password
  );

  console.log(helpers.formatGenerationResult(result));

  if (!result.success) {
    process.exit(1);
  }
}

function generateSample() {
  const useCase = args[1];
  const appName = args[2];
  
  if (!useCase) {
    console.error('Error: Please provide a use case');
    console.log('Usage: node cli.js sample <use-case> [app-name]');
    console.log('Available use cases: ticketing, asset, project');
    process.exit(1);
  }

  console.log(`\n📝 Generating sample configuration for: ${useCase}\n`);

  const options = {};
  if (appName) {
    options.appName = appName;
    options.appScope = helpers.generateScopeFromName(appName);
  }

  const config = helpers.generateSampleConfig(useCase, options);
  
  const filename = `${config.appScope}_config.json`;
  const outputPath = helpers.exportConfigToFile(config, filename);

  console.log(`✅ Sample configuration saved to: ${outputPath}`);
  console.log('\nConfiguration details:');
  console.log(`  App Name: ${config.appName}`);
  console.log(`  App Scope: ${config.appScope}`);
  console.log(`  Description: ${config.description}`);
  console.log(`\nYou can now edit this file and generate the app using:`);
  console.log(`  node cli.js generate ${filename}`);
}

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = { main };
