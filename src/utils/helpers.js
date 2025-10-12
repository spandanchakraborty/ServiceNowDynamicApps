/**
 * Utility functions for the Dynamic App Generator
 */

/**
 * Generate a valid ServiceNow scope from app name
 * @param {string} appName - Application name
 * @returns {string} Valid ServiceNow scope
 */
function generateScopeFromName(appName) {
  return 'x_' + appName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generate a valid table name from label
 * @param {string} label - Table label
 * @returns {string} Valid table name
 */
function generateTableName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generate a valid field name from label
 * @param {string} label - Field label
 * @returns {string} Valid field name
 */
function generateFieldName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Validate ServiceNow scope format
 * @param {string} scope - Scope to validate
 * @returns {boolean} True if valid
 */
function isValidScope(scope) {
  return /^x_[a-z0-9_]+$/.test(scope);
}

/**
 * Generate a sample configuration for a specific use case
 * @param {string} useCase - Type of use case (ticketing, asset, project, etc.)
 * @param {Object} options - Customization options
 * @returns {Object} Sample configuration
 */
function generateSampleConfig(useCase, options = {}) {
  const templates = require('../templates');
  
  const useCaseMap = {
    ticketing: 'ticketing',
    ticket: 'ticketing',
    asset: 'assetManagement',
    assets: 'assetManagement',
    project: 'projectManagement',
    projects: 'projectManagement'
  };

  const templateName = useCaseMap[useCase.toLowerCase()];
  if (!templateName || !templates[templateName]) {
    throw new Error(`Unknown use case: ${useCase}`);
  }

  const template = { ...templates[templateName] };
  
  // Apply options
  if (options.appName) {
    template.appName = options.appName;
  }
  if (options.appScope) {
    template.appScope = options.appScope;
  } else if (options.appName) {
    template.appScope = generateScopeFromName(options.appName);
  }
  if (options.description) {
    template.description = options.description;
  }

  return template;
}

/**
 * Format generation result for display
 * @param {Object} result - Generation result
 * @returns {string} Formatted output
 */
function formatGenerationResult(result) {
  if (!result.success) {
    return `❌ Generation failed: ${result.error}\n${result.details ? result.details.join('\n') : ''}`;
  }

  let output = `✅ App generated successfully!\n\n`;
  output += `📦 Application Scope: ${result.appScope}\n\n`;
  output += `📊 Components Created:\n`;

  if (result.components.application) {
    output += `  • Application: ${result.components.application.data.name}\n`;
  }

  if (result.components.tables) {
    output += `  • Tables: ${result.components.tables.length}\n`;
    result.components.tables.forEach(table => {
      output += `    - ${table.data.label} (${table.data.name})\n`;
      if (table.fields) {
        output += `      Fields: ${table.fields.length}\n`;
      }
    });
  }

  if (result.components.forms) {
    output += `  • Forms: ${result.components.forms.length}\n`;
  }

  if (result.components.businessRules) {
    output += `  • Business Rules: ${result.components.businessRules.length}\n`;
  }

  if (result.components.uiPolicies) {
    output += `  • UI Policies: ${result.components.uiPolicies.length}\n`;
  }

  if (result.components.workflows) {
    output += `  • Workflows: ${result.components.workflows.length}\n`;
  }

  if (result.components.roles) {
    output += `  • Roles: ${result.components.roles.length}\n`;
  }

  if (result.components.menus) {
    output += `  • Menus: ${result.components.menus.length}\n`;
  }

  if (result.generationLog && result.generationLog.length > 0) {
    output += `\n📝 Generation Log:\n`;
    result.generationLog.forEach(log => {
      output += `  ${log.timestamp} - ${log.message}\n`;
    });
  }

  return output;
}

/**
 * Export configuration to JSON file
 * @param {Object} config - Configuration to export
 * @param {string} filename - Output filename
 */
function exportConfigToFile(config, filename) {
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.resolve(filename);
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), 'utf8');
  
  return outputPath;
}

/**
 * Import configuration from JSON file
 * @param {string} filename - Input filename
 * @returns {Object} Configuration object
 */
function importConfigFromFile(filename) {
  const fs = require('fs');
  const path = require('path');
  
  const inputPath = path.resolve(filename);
  const content = fs.readFileSync(inputPath, 'utf8');
  
  return JSON.parse(content);
}

module.exports = {
  generateScopeFromName,
  generateTableName,
  generateFieldName,
  isValidScope,
  generateSampleConfig,
  formatGenerationResult,
  exportConfigToFile,
  importConfigFromFile
};
